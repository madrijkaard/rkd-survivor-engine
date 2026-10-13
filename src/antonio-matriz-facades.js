// Motifs observed in the eight-view sheets, not generated replacement photos.
export function drawMatrizFacade(c,b,w,h){
  if(b.detail==='am-cobogo'||b.detail==='am-cobogo-aa'){
    for(let x=5;x<w-9;x+=24){
      c.fillStyle='#424b38';c.fillRect(x,h*.06,18,h*.21);
      c.strokeStyle='#b8aa7b';c.lineWidth=1.5;
      for(let k=0;k<3;k++){c.beginPath();c.ellipse(x+3+k*6,h*.15,4,h*.065,0,0,Math.PI*2);c.stroke();}
    }
    for(let i=0;i<18;i++){
      const x=(i*37)%w,y=h*(.79+(i%3)*.05);
      c.fillStyle=i%2?'#b68560':'#9d7c5a';c.fillRect(x,y,8,3);
      c.fillStyle='#c2ad8b';c.fillRect(x,y+2,8,.6);
    }
  }
  if(b.detail==='am-white-bars'){
    const p=b.openings.find(o=>o.kind==='porch');
    const x=p.u*w,y=h*(1-p.bottom-p.h),ww=p.w*w,hh=p.h*h;
    c.fillStyle='#57614f';c.fillRect(x,y,ww,hh);
    c.strokeStyle='#dfe1d5';c.lineWidth=1.8;
    for(let xx=x+3;xx<x+ww;xx+=5){c.beginPath();c.moveTo(xx,y);c.bezierCurveTo(xx+3,y+hh*.4,xx-3,y+hh*.6,xx,y+hh);c.stroke();}
  }
  if(b.detail==='am-school-sealed'){
    for(const u of [.07,.39,.74]){
      const x=u*w,y=h*.35,ww=w*.17,hh=h*.60;
      c.fillStyle='#9c9b87';c.fillRect(x-2,y-2,ww+4,hh+4);
      for(let row=0;row<hh;row+=3)for(let col=0;col<ww;col+=6){
        c.fillStyle=(row+col)%4?'#bb875f':'#a47c57';c.fillRect(x+col,y+row,5,2.3);
      }
    }
    c.fillStyle='#3c4640';c.beginPath();c.ellipse(w*.67,h*.65,w*.075,h*.22,0,0,Math.PI*2);c.fill();
    c.fillStyle='#c7b284';c.beginPath();c.ellipse(w*.67,h*.60,w*.035,h*.09,0,0,Math.PI*2);c.fill();
  }
  if(b.detail==='am-hearts'){
    c.strokeStyle='#ac795c';c.lineWidth=.8;
    for(let i=0;i<16;i++){
      const x=((i*29+7)%97)/100*w,y=(.22+(i%4)*.18)*h;
      c.beginPath();c.moveTo(x,y+4);c.bezierCurveTo(x-8,y-1,x-3,y-6,x,y-2);c.bezierCurveTo(x+3,y-6,x+8,y-1,x,y+4);c.stroke();
    }
  }
  if(b.detail==='am-rough-wall'||b.detail==='am-electric-wall'){
    for(let i=0;i<Math.ceil(w*.9);i++){
      const x=(i*43)%w,y=(i*29)%h;
      c.fillStyle=i%3?'#5b655430':'#e1dfbf50';c.fillRect(x,y,1+(i%3),.8);
    }
    for(let i=0;i<9;i++){c.fillStyle='#57604c33';c.fillRect((i*73)%w,0,1+i%3,h*(.22+i%4*.17));}
  }
}
