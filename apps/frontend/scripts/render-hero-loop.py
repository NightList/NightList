# เรนเดอร์วิดีโอพื้นหลังหน้าแรก (วนรอบเนียน) จากภาพ hero-poster.jpg
# ใช้: cd apps/frontend && python3 scripts/render-hero-loop.py 48 raw.mp4  (ต้องมี numpy, pillow, ffmpeg)
# แล้วเข้ารหัส: ffmpeg -i raw.mp4 -crf 22 -c:v libx264 -preset slow -tune film -x264-params keyint=384:min-keyint=384:scenecut=0 -pix_fmt yuv420p -movflags +faststart -an public/videos/hero-night-720.mp4
import numpy as np, subprocess as sp, math, sys
from PIL import Image, ImageFilter
W,H=1280,720; FPS=int(sys.argv[1]) if len(sys.argv)>1 else 48; T=8.0; N=int(T*FPS)
OUT=sys.argv[2] if len(sys.argv)>2 else 'raw.mp4'
rng=np.random.default_rng(7)
base_img=Image.open('public/images/home/hero-poster.jpg').convert('RGB').resize((W,H),Image.LANCZOS)
base=np.asarray(base_img).astype(np.float32)/255
L=base.mean(2)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
TAU=2*math.pi
def per(k): return k*TAU/T          # ความถี่ที่ลงตัวกับรอบ T (วนเนียน)

# ---- 1) ดาวกะพริบ: จุดสว่างเล็กๆ ในท้องฟ้า (ส่วนบน) ----
sky=(yy<H*0.42)
blur=np.asarray(base_img.convert('L').filter(ImageFilter.GaussianBlur(3))).astype(np.float32)/255
star=np.clip((L-blur-0.10)*4,0,1)*sky
lab=rng.random((H,W)).astype(np.float32)  # เฟสต่อพิกเซล → ใช้ blur ให้ทั้งดวงกะพริบพร้อมกัน
phase=np.asarray(Image.fromarray((lab*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32)/255*TAU*3
kstar=rng.integers(1,4,(H,W)).astype(np.float32)  # 1-3 รอบต่อ T

# ---- 2) ไฟเมือง/แสงสะท้อนระยิบ (ส่วนล่าง) ----
city=(yy>H*0.50)
lights=np.clip((L-0.55)*2.5,0,1)*city
cphase=np.asarray(Image.fromarray((rng.random((H//6,W//6))*255).astype(np.uint8)).resize((W,H),Image.BILINEAR)).astype(np.float32)/255*TAU
# ---- 3) หมุดทอง/ม่วง + เทียน: เรืองแสงเป็นจังหวะ (หาจากสีอิ่มตัวสว่าง) ----
r,g,b=base[...,0],base[...,1],base[...,2]
gold=np.clip((r-b-0.25)*3,0,1)*np.clip((L-0.45)*3,0,1)*(yy>H*0.5)
purp=np.clip((b-g-0.25)*3,0,1)*np.clip((r-g-0.1)*3,0,1)*np.clip((L-0.35)*3,0,1)*(yy>H*0.5)
glowsrc=np.clip(gold+purp,0,1)
glow=np.asarray(Image.fromarray((glowsrc*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9))).astype(np.float32)/255
glowcol=np.asarray(Image.fromarray((base*glowsrc[...,None]*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9))).astype(np.float32)/255
gphase=np.asarray(Image.fromarray((rng.random((H//40,W//40))*255).astype(np.uint8)).resize((W,H),Image.BILINEAR)).astype(np.float32)/255*TAU
# ---- 4) น้ำ: คลื่นแนวนอนเล็กน้อยในแม่น้ำ ----
water=((yy>H*0.69)&(yy<H*0.93)&(xx>W*0.36)&(xx<W*0.83)).astype(np.float32)
water=np.asarray(Image.fromarray((water*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(25))).astype(np.float32)/255

# ---- 5) ดาวตก: วิ่งทางเดียว ซ้ายบน→ขวาล่าง เวลาเริ่มกระจายในรอบ (ห่อรอบด้วย mod T) ----
METEORS=[]
for i in range(4):
    dur=rng.uniform(0.9,1.4); t0=0.6+i*(T-1.2-1.4)/3+rng.uniform(0,0.3)  # ไม่มีดาวตกช่วงรอยต่อรอบ (±0.6 วิ)
    x0=rng.uniform(W*0.25,W*0.85); y0=rng.uniform(H*0.03,H*0.22)
    ang=math.radians(rng.uniform(155,165)); sp_=rng.uniform(420,560); ln=rng.uniform(90,150)
    METEORS.append((t0,dur,x0,y0,ang,sp_,ln))
def meteor_layer(t):
    lay=np.zeros((H,W),np.float32)
    for (t0,dur,x0,y0,ang,spd,ln) in METEORS:
        u=((t-t0)%T)
        if u>dur: continue
        p=u/dur; a=math.sin(math.pi*p)  # ค่อยๆ สว่างแล้วจาง
        hx=x0+math.cos(ang)*spd*u; hy=y0-math.sin(ang)*spd*u*-1
        dx,dy=math.cos(ang),math.sin(ang)*-1*-1
        # ระยะจากเส้นหาง
        vx,vy=-math.cos(ang),-math.sin(ang)
        # local box for speed
        x1,x2=int(max(0,min(hx,hx+vx*ln)-6)),int(min(W,max(hx,hx+vx*ln)+6))
        y1,y2=int(max(0,min(hy,hy+vy*ln)-6)),int(min(H,max(hy,hy+vy*ln)+6))
        if x2<=x1 or y2<=y1: continue
        X=xx[y1:y2,x1:x2]-hx; Y=yy[y1:y2,x1:x2]-hy
        s=np.clip(X*vx+Y*vy,0,ln)          # ตำแหน่งตามหาง
        d=np.abs(X*vy-Y*vx)                 # ระยะตั้งฉาก
        tail=(1-s/ln)**1.6*np.exp(-(d**2)/(2*(0.9+0.6*(1-s/ln))**2))
        head=np.exp(-((X)**2+(Y)**2)/(2*2.2**2))*1.4
        lay[y1:y2,x1:x2]+=a*(tail+head)
    return np.clip(lay,0,1.5)

enc=sp.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','8','-pix_fmt','yuv444p',OUT],stdin=sp.PIPE)
mcol=np.array([1.0,0.93,0.80],np.float32)
for k in range(N):
    t=k/FPS
    img=base.copy()
    # water ripple (horizontal displacement, periodic)
    off=(np.sin(yy*0.35+per(3)*t)*1.6+np.sin(yy*0.11-per(2)*t)*1.0)*water
    xs=np.clip(xx+off,0,W-1); x0i=xs.astype(np.int32); f=(xs-x0i)[...,None]; x1i=np.minimum(x0i+1,W-1)
    rows=yy.astype(np.int32)
    img=img*(1-water[...,None])+ (base[rows,x0i]*(1-f)+base[rows,x1i]*f)*water[...,None]
    # stars twinkle
    tw=0.5+0.5*np.sin(per(1)*t*kstar+phase)
    img+= (star*(tw-0.5)*0.9)[...,None]*np.array([0.95,0.92,1.0],np.float32)
    # city shimmer
    sh=np.sin(per(2)*t+cphase)*0.5+np.sin(per(5)*t+cphase*2.3)*0.5
    img*= (1+lights*sh*0.10)[...,None]
    # pins glow pulse
    pulse=0.5+0.5*np.sin(per(1)*t+gphase)
    img+= glowcol*(0.35+0.55*pulse)[...,None]*1.2
    # meteors
    m=meteor_layer(t)
    img+= m[...,None]*mcol
    enc.stdin.write((np.clip(img,0,1)*255+0.5).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait(); print('done',N)
