import subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SRC = sys.argv[1]
OUT = sys.argv[2]
W, H, FPS = 1080, 1920, 30
work = "/tmp/edit/work"
os.makedirs(work, exist_ok=True)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def caption(name, text, size=96, color=(255, 255, 255), stroke=(0, 0, 0), y=0.22, glow=None):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    f = ImageFont.truetype(FONT, size, layout_engine=ImageFont.Layout.RAQM)
    d = ImageDraw.Draw(img)
    lines = text.split("\n")
    yy = int(H * y)
    for ln in lines:
        bb = d.textbbox((0, 0), ln, font=f, direction="rtl" if any("֐" <= c <= "׿" for c in ln) else None)
        tw = bb[2] - bb[0]
        x = (W - tw) // 2 - bb[0]
        kw = dict(font=f, direction="rtl" if any("֐" <= c <= "׿" for c in ln) else None)
        if glow:
            g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            ImageDraw.Draw(g).text((x, yy), ln, fill=glow, stroke_width=14, stroke_fill=glow, **kw)
            img = Image.alpha_composite(img, g.filter(ImageFilter.GaussianBlur(18)))
            d = ImageDraw.Draw(img)
        d.text((x, yy), ln, fill=color, stroke_width=8, stroke_fill=stroke, **kw)
        yy += int(size * 1.25)
    p = f"{work}/{name}.png"
    img.save(p)
    return p


def run(args):
    print(" ".join(args)[:300], flush=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, check=True)


ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS),
       "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2"]

# Fixed-size vertical crop out of the 1280x720 landscape source
CW, CH = 405, 720


def track(points, tvar="t"):
    """piecewise-linear expression of crop center x over (source) time."""
    e = str(points[-1][1])
    for (t0, x0), (t1, x1) in reversed(list(zip(points, points[1:]))):
        e = f"if(lt({tvar},{t1}),{x0}+({x1}-{x0})*({tvar}-{t0})/({t1}-{t0}),{e})"
    e = f"if(lt({tvar},{points[0][0]}),{points[0][1]},{e})"
    return f"max(0,min(iw-{CW},({e})-{CW//2}))"


def punch(zexpr):
    # variable zoom on an already W x H frame, re-cropped to W x H
    return (f"scale=w='trunc({W}*({zexpr})/2)*2':h='trunc({H}*({zexpr})/2)*2':eval=frame:flags=bicubic,"
            f"crop={W}:{H}:(iw-{W})/2:(ih-{H})/2")


GRADE = "eq=contrast=1.12:saturation=1.35:gamma=0.97,unsharp=5:5:0.6"

# ---------- captions ----------
c1 = caption("c1", "מחכים לרגע\nהנכון...", 104, y=0.16)
c2 = caption("c2", "הנה הוא מגיע", 110, color=(255, 230, 0), y=0.16)
c3 = caption("c3", "SEND IT", 190, color=(255, 255, 255), stroke=(200, 0, 30), y=0.30, glow=(255, 40, 60, 255))
c4 = caption("c4", "◀◀ REPLAY", 120, color=(255, 255, 255), stroke=(0, 0, 0), y=0.12)
c5 = caption("c5", "רוכבים על הקצה", 120, color=(255, 255, 255), stroke=(0, 0, 0), y=0.22, glow=(255, 160, 0, 255))

segs = []

# A: the wait, 0 -> 10.4s sped up 5x, slow push-in
A0, A1, SPA = 0.0, 10.4, 5.0
dA = (A1 - A0) / SPA
run(["-ss", str(A0), "-t", str(A1 - A0), "-i", SRC, "-loop", "1", "-i", c1, "-filter_complex",
     f"[0:v]setpts=(PTS-STARTPTS)/{SPA},fps={FPS},crop={CW}:{CH}:{620-CW//2}:0,scale={W}:{H}:flags=lanczos,{GRADE},"
     f"{punch(f'1+0.08*t/{dA}')}[v0];"
     f"[1:v]format=rgba,fade=in:st=0.15:d=0.25:alpha=1[t];[v0][t]overlay=0:0:shortest=1,fade=in:st=0:d=0.2[v];"
     f"[0:a]atempo=2.5,atempo=2.0,volume=0.6[a]",
     "-map", "[v]", "-map", "[a]", "-t", f"{dA:.3f}"] + ENC + [f"{work}/A.mp4"])
segs.append("A")

# B: approach, real time 10.4 -> 13.4, tracking + building zoom + light shake at the end
B0, B1 = 10.4, 13.4
ptsB = [(12.0, 600), (13.0, 610), (13.4, 640)]
run(["-ss", str(B0), "-t", str(B1 - B0), "-i", SRC, "-loop", "1", "-i", c2, "-filter_complex",
     f"[0:v]setpts=PTS-STARTPTS,crop={CW}:{CH}:'{track(ptsB, f'(t+{B0})')}':0,scale={W}:{H}:flags=lanczos,{GRADE},"
     f"{punch(f'1.08+0.22*pow(t/{B1-B0},2)')}[v0];"
     f"[1:v]format=rgba,fade=in:st=0.6:d=0.2:alpha=1[t];[v0][t]overlay=0:0:shortest=1[v];"
     f"[0:a]volume=1.3[a]",
     "-map", "[v]", "-map", "[a]", "-t", f"{B1-B0:.3f}"] + ENC + [f"{work}/B.mp4"])
segs.append("B")

# C: the pass in slow motion (motion-interpolated), flash + bass hit
C0, C1, SLOW = 13.4, 14.55, 3.0
dC = (C1 - C0) * SLOW
ptsC = [(13.4, 640), (13.9, 840), (14.15, 880), (14.3, 980), (14.55, 1150)]
run(["-ss", str(C0), "-t", str(C1 - C0), "-i", SRC, "-loop", "1", "-i", c3,
     "-f", "lavfi", "-t", f"{dC:.3f}", "-i",
     "aevalsrc='0.9*sin(2*PI*(38+60*exp(-8*t))*t)*exp(-2.2*t)':s=44100:c=stereo",
     "-filter_complex",
     f"[0:v]setpts=PTS-STARTPTS,crop={CW}:{CH}:'{track(ptsC, f'(t+{C0})')}':0,"
     f"minterpolate=fps={FPS*SLOW:.0f}:mi_mode=mci:mc_mode=aobmc:vsbmc=1,setpts=PTS*{SLOW},fps={FPS},"
     f"scale={W}:{H}:flags=lanczos,{GRADE},"
     f"{punch(f'1.3+0.12*t/{dC}')},"
     # white flash at the drop
     f"eq=brightness='if(lt(t,0.25),0.6*(1-t/0.25),0)':eval=frame,"
     f"vignette=PI/4.5[v0];"
     f"[1:v]format=rgba,fade=in:st=0.05:d=0.15:alpha=1[t];[v0][t]overlay=0:0:shortest=1[v];"
     f"[0:a]asetrate=44100*0.6,aresample=44100,atempo={(1/SLOW)/0.6:.4f},lowpass=f=4000,volume=2.2,"
     f"aformat=channel_layouts=stereo[sa];"
     f"[sa][2:a]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.95[a]",
     "-map", "[v]", "-map", "[a]", "-t", f"{dC:.3f}"] + ENC + [f"{work}/C.mp4"])
segs.append("C")

# D: fast rewind 14.55 -> 12.6, reversed at 4x, with RGB split + shake
D0, D1, SPD = 12.6, 14.55, 4.0
dD = (D1 - D0) / SPD
run(["-ss", str(D0), "-t", str(D1 - D0), "-i", SRC, "-loop", "1", "-i", c4, "-filter_complex",
     f"[0:v]setpts=PTS-STARTPTS,reverse,setpts=PTS/{SPD},fps={FPS},"
     f"crop={CW}:{CH}:'{track(ptsC + [], f'({D1}-t*{SPD})')}':0,scale={W}:{H}:flags=lanczos,{GRADE},"
     f"rgbashift=rh=-14:bh=14,{punch('1.12')},"
     f"crop=w={W-40}:h={H-70}:x='20+18*sin(t*90)':y='35+30*cos(t*70)',scale={W}:{H},"
     f"hue=s=0.6,noise=alls=18:allf=t[v0];"
     f"[1:v]format=rgba[t];[v0][t]overlay=0:0:shortest=1[v];"
     f"[0:a]areverse,atempo=2.0,atempo=2.0,highpass=f=300,volume=0.9[a]",
     "-map", "[v]", "-map", "[a]", "-t", f"{dD:.3f}"] + ENC + [f"{work}/D.mp4"])
segs.append("D")

# E: replay of the full wide shot (letterboxed over blurred bg), real speed
E0, E1 = 12.6, 14.55
run(["-ss", str(E0), "-t", str(E1 - E0), "-i", SRC, "-filter_complex",
     f"[0:v]setpts=PTS-STARTPTS,{GRADE},split[a1][b1];"
     f"[a1]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=30:3,eq=brightness=-0.12[bg];"
     f"[b1]scale=1260:-2:flags=lanczos,crop={W}:ih:(iw-{W})/2:0[fg];"
     f"[bg][fg]overlay=0:(H-h)/2,{punch(f'1+0.06*t/{E1-E0}')}[v];"
     f"[0:a]volume=1.4[a]",
     "-map", "[v]", "-map", "[a]", "-t", f"{E1-E0:.3f}"] + ENC + [f"{work}/E.mp4"])
segs.append("E")

# F: freeze on the lean + title, fade out
FT, dF = 14.18, 2.2
ptsF = [(14.18, 960)]
run(["-ss", str(FT), "-i", SRC, "-loop", "1", "-i", c5,
     "-f", "lavfi", "-t", f"{dF}", "-i",
     "aevalsrc='0.7*sin(2*PI*45*t)*exp(-3*t)':s=44100:c=stereo",
     "-filter_complex",
     f"[0:v]trim=end_frame=1,loop=loop={int(dF*FPS)}:size=1:start=0,setpts=N/{FPS}/TB,fps={FPS},"
     f"crop={CW}:{CH}:{960-CW//2}:0,scale={W}:{H}:flags=lanczos,{GRADE},"
     f"{punch(f'1.25+0.15*t/{dF}')},"
     f"eq=brightness='if(lt(t,0.15),0.5*(1-t/0.15),0)':eval=frame,vignette=PI/4[v0];"
     f"[1:v]format=rgba,fade=in:st=0.1:d=0.3:alpha=1[t];[v0][t]overlay=0:0:shortest=1,"
     f"fade=out:st={dF-0.5}:d=0.5[v];"
     f"[2:a]afade=out:st={dF-0.6}:d=0.6[a]",
     "-map", "[v]", "-map", "[a]", "-t", f"{dF}"] + ENC + [f"{work}/F.mp4"])
segs.append("F")

with open(f"{work}/list.txt", "w") as fh:
    for s in segs:
        fh.write(f"file '{work}/{s}.mp4'\n")
run(["-f", "concat", "-safe", "0", "-i", f"{work}/list.txt",
     "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
     "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-movflags", "+faststart", OUT])
print("done", OUT)
