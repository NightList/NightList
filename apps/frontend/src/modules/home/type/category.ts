/** การ์ดหมวดหมู่ในหน้าแรก — ลิงก์ไป /ranking?category= หรือ /search?style= */
export interface HomeCategory {
  key: string;
  title: string;
  subtitle: string;
  to: string;
  /** รูปการ์ด public/images/categories/<key>.webp (240×312) */
  image: string;
}
