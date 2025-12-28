
import { Property } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'פנטהאוז יוקרתי עם נוף לים',
    location: 'תל אביב, צפון ישן',
    price: 12500000,
    bedrooms: 5,
    bathrooms: 3,
    area: 220,
    type: 'Penthouse',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: 'פנטהאוז מדהים ביופיו עם מרפסת שמש ענקית הצופה לים התיכון. עיצוב אדריכלי ברמה הגבוהה ביותר.',
    featured: true
  },
  {
    id: '2',
    title: 'וילה מודרנית בהרצליה פיתוח',
    location: 'הרצליה פיתוח',
    price: 24000000,
    bedrooms: 7,
    bathrooms: 5,
    area: 450,
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    description: 'וילה חדשה מהניילון, בריכת שחייה פרטית, מערכות בית חכם ומטבח שף מאובזר.',
    featured: true
  },
  {
    id: '3',
    title: 'דירת גן מעוצבת ברמת אביב',
    location: 'רמת אביב ג\'',
    price: 6800000,
    bedrooms: 4,
    bathrooms: 2,
    area: 140,
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    description: 'דירת גן שקטה ומוארת בלב השכונה המבוקשת. גינה פרטית מטופחת של 100 מ"ר.',
    featured: false
  },
  {
    id: '4',
    title: 'לופט תעשייתי בשכונת פלורנטין',
    location: 'תל אביב, פלורנטין',
    price: 4200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    description: 'לופט ייחודי עם תקרות גבוהות וחלונות ענק. מתאים למי שמחפש אופי וסטייל בלב העיר.',
    featured: false
  }
];
