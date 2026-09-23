// Levantamento visual das 136 fotografias de maps/simeao-de-macedo/, segunda revisão.
// u/w medem posição/largura ao longo da rua, do início (sul) à esquina (norte).
// bottom/h medem a abertura em relação à altura da fachada. Não são medidas reais.
const opening = (kind, u, w, bottom, h, extra = {}) => ({ kind, u, w, bottom, h, ...extra });
const door = (u, w, extra = {}) => opening('door', u, w, 0, .73, extra);
const window = (u, w, extra = {}) => opening('window', u, w, .31, .42, extra);
const gate = (u, w, extra = {}) => opening('gate', u, w, 0, .74, extra);
const shutter = (u, w, extra = {}) => opening('shutter', u, w, 0, .73, extra);
const sign = (u, top, w, h, text, extra = {}) => ({ u, top, w, h, text, ...extra });
const west = (id, start, end, data) => ({ id, side: 'west', x: -238, y: start, depth: 158, length: end - start, height: 59, roof: 'tile', color: '#d4cec0', base: '#999788', baseHeight: .12, wear: .2, openings: [], signs: [], ...data });
const east = (id, start, end, data) => ({ id, side: 'east', x: 80, y: start, depth: 152, length: end - start, height: 60, roof: 'tile', color: '#d4cec0', base: '#999788', baseHeight: .12, wear: .2, openings: [], signs: [], ...data });

export const streetBuildings = [
  west('w01-casa-porta-verde', -55, 90, {
    name: 'Casa branca e vinho, porta verde', point: 1, refs: [[1,7],[1,6],[2,6]], color: '#e3dfd2', base: '#a34949', baseHeight: .32,
    openings: [shutter(.07,.32,{color:'#929b91'}), door(.79,.10,{color:'#72844b',wood:true}), opening('vent',.70,.045,.57,.095)],
    signs: [sign(.55,.25,.14,.07,'R. SIMEÃO',{color:'#355866',ink:'#d6dacf'})], meters: [.55],
  }),
  west('w02-casa-branca-vinho', 90, 223, {
    name: 'Fachada branca e vinho, dois portões', point: 2, refs: [[2,7],[2,8],[3,6]], color: '#e1dfd5', base: '#a94849', baseHeight: .24, roof: 'hidden-tile', parapet: 9,
    openings: [gate(.04,.31,{color:'#a4aea8',grille:'vertical',solid:.83}), door(.79,.095,{color:'#afb7aa',grille:'diagonal'})], meters: [.70],
  }),
  west('w03-casa-salmao', 223, 341, {
    name: 'Casa salmão de uma porta', point: 3, refs: [[3,7],[3,8]], color: '#dba18a', base: '#657479', baseHeight: .13, roof: 'shed', roofColor: '#ad7252', height: 54,
    openings: [door(.48,.19,{color:'#9a9f95',grille:'star'})], meters: [.14], steps: true,
  }),
  // Entre w03 e w04 há um muro de jardim, não uma sequência de casas.
  west('w04-fachada-rosa-antiga', 752, 848, {
    name: 'Fachada rosa deteriorada, janela vedada', point: 7, refs: [[6,8],[7,7],[7,6]], color: '#c6a599', base: '#9b9280', wear: .9, roof: 'hidden-tile', parapet: 8, height: 65, trim: 'historic',
    openings: [opening('bricked',.09,.30,.33,.49,{color:'#d9b3aa'}), door(.75,.17,{color:'#6d5a3f',grille:'sunburst'}), opening('bricked',.75,.17,.76,.18,{color:'#d9b3aa'})],
  }),
  west('w05-casa-cinza-grades', 848, 939, {
    name: 'Casa cinza, janela e portão escuros', point: 7, refs: [[7,7],[8,6]], color: '#c6ccd0', base: '#a9adb0',
    openings: [window(.10,.28,{color:'#715947',grille:'scroll',bars:'#3d3b35'}), gate(.54,.38,{color:'#363a33',grille:'scroll',recess:true})], steps: true,
  }),
  west('w06-casa-azulejo-vinho', 939, 1020, {
    name: 'Azulejo branco, rodapé vinho e grade comprida', point: 8, refs: [[8,7],[8,8]], color: '#dcded5', base: '#a54040', baseHeight: .25, pattern: 'small-tile', roof: 'hidden-tile', parapet: 18, height: 70, trim:'blank-fascia',
    openings: [opening('window',.08,.69,.43,.33,{color:'#3f483c',grille:'scroll',bars:'#d5d7c5'}), door(.84,.11,{color:'#515b4c',grille:'diamond',bars:'#dce0d0',h:.60})], meters:[.03],
  }),
  west('w07-varanda-bege', 1020, 1090, {
    name: 'Varanda bege, grade branca com estrelas', point: 9, refs: [[8,7],[9,6],[9,7]], color:'#c6b79c', base:'#92795c', baseHeight:.16,
    openings:[opening('porch',.05,.90,0,.78,{color:'#626353',grille:'star',bars:'#daddc8',solid:.18})], paving:'octagon',
  }),
  west('w08-clinica-alianca', 1090, 1183, {
    name:'Aliança Odontologia', point:9, refs:[[9,7],[9,8],[10,6]], color:'#a8b5bb', base:'#a8b5bb', baseHeight:0, roof:'hidden-tile', parapet:19, height:76, detail:'dental',
    openings:[gate(.03,.55,{color:'#6c7c6a',grille:'square',bars:'#d6dbcc',recess:true,h:.67})],
    signs:[sign(.64,.42,.32,.18,'ALIANÇA',{color:'#4095b2',ink:'#e5e8d3',sub:'Odontologia Integrada'})], paving:'cream-tile',
  }),
  west('w09-casa-ceramica-branca', 1183, 1284, {
    name:'Casa de cerâmica branca', point:10, refs:[[10,7],[10,6]], color:'#d9dad1', base:'#bdc0b3', pattern:'white-tile', wear:.3,
    openings:[door(.07,.16,{color:'#5d4837',wood:true,grille:'vertical',bars:'#393e37'}), window(.56,.31,{color:'#80654a',grille:'scroll',bars:'#756048'})], mailbox:.90,
  }),
  west('w10-casa-bege-chevron', 1284, 1387, {
    name:'Casa bege com portão e duas janelas brancas', point:11, refs:[[10,7],[11,7],[11,6]], color:'#c5bba5', base:'#9e9c85', pattern:'pebble-bands',
    openings:[gate(.04,.32,{color:'#586156',grille:'chevron',bars:'#e1e3d7',solid:.30}), window(.49,.16,{color:'#48524c',grille:'chevron',bars:'#e1e3d7'}), window(.76,.16,{color:'#48524c',grille:'chevron',bars:'#e1e3d7'})],
  }),
  west('w11-muro-azul-pessego', 1387, 1492, {
    name:'Muro azul claro com painéis pêssego', point:12, refs:[[11,8],[12,7],[12,6]], color:'#a5bcba', base:'#7f9d96', height:43, detail:'courtyard', roof:'courtyard', wear:.38,
    panels:[{u:.03,w:.28,color:'#c9b29b'},{u:.62,w:.19,color:'#c9b29b'},{u:.84,w:.16,color:'#c7b99f'}],
    openings:[gate(.34,.26,{color:'#deded2',solid:1,grille:'vertical',h:.65}), shutter(.86,.11,{color:'#dddfd7',h:.70})], steps:true,
  }),
  west('w12-sobrado-losangos', 1492, 1586, {
    name:'Sobrado com grades brancas em losango', point:12, refs:[[12,7],[13,6]], color:'#cbbca5', base:'#d7d9c9', baseHeight:.46, height:112, roof:'hidden-tile', parapet:12, pattern:'circle-base', sideColor:'#9cc8be', wear:.26,
    openings:[opening('gate',.04,.44,0,.45,{color:'#655d4c',grille:'diamond',bars:'#e6e5d2'}), opening('gate',.55,.41,0,.45,{color:'#6b6755',grille:'diamond',bars:'#e6e5d2'}), opening('balcony',.07,.72,.63,.21,{color:'#756958',grille:'diamond',bars:'#e4e2cc'}), opening('vent',.84,.05,.71,.09,{color:'#485b56',grille:'horizontal'})], trim:'storey',
  }),
  west('w13-casa-porta-persiana', 1586, 1682, {
    name:'Casa branca, porta creme e persiana dupla', point:13, refs:[[13,7],[13,8]], color:'#dedbc9', base:'#a9a493', wear:.48, height:53,
    openings:[door(.09,.19,{color:'#b4ac88',wood:true}), shutter(.47,.46,{color:'#b8b598',double:true})], steps:true,
  }),
  // O recuo de tijolos em 1682–1739 é modelado à parte, sem fechar sua frente.
  west('w14-casa-creme-porta-preta', 1739, 1846, {
    name:'Casa creme, porta preta e janela pequena', point:14, refs:[[14,7],[14,8]], color:'#d8d3b9', base:'#999d86', wear:.27, height:53,
    openings:[door(.45,.16,{color:'#644837',grille:'vertical',bars:'#27332f',solid:.22}), window(.74,.12,{color:'#68523d',grille:'diagonal',bars:'#313b32',h:.32,bottom:.37})],
  }),
  west('w15-fc-motos-yamaha', 1846, 2288, {
    name:'Bar O Péricles, no trecho indicado pelo usuário', point:16, refs:[[15,7],[16,7],[17,7],[17,6]], color:'#dcd2ac', base:'#417fa4', baseHeight:.31, height:62, wear:.38, detail:'bar', roofColor:'#9c6848',
    openings:[window(.31,.037,{color:'#293d35',grille:'vertical',bars:'#313d32',h:.27}), door(.39,.071,{color:'#1e302a',open:true,frame:'#3175a1',h:.72}), door(.57,.071,{color:'#1e302a',open:true,frame:'#3175a1',h:.72}), window(.68,.037,{color:'#4b4935',grille:'star',bars:'#344234',h:.28}), shutter(.944,.043,{color:'#377da4',h:.72})],
    signs:[sign(.30,.21,.48,.17,'BAR O PÉRICLES',{color:'#dad0aa',ink:'#894c3f'})], brickBand:.05,
  }),

  east('e01-casa-rosa-reboco', 607, 736, {
    name:'Casa rosa com reboco exposto', point:6, refs:[[5,2],[6,3],[6,4]], color:'#d2b9b2', base:'#c3c0a9', sideColor:'#9c9c8e', baseHeight:.24, wear:.65, height:66, detail:'exposed-plaster',
    openings:[shutter(.14,.20,{color:'#a4ada4',h:.66,awning:true}), gate(.57,.30,{color:'#646450',grille:'scroll',bars:'#c2c6ae',recess:true,h:.68})], steps:true, ramp:.57,
  }),
  east('e02-casa-ceramica-marrom', 736, 815, {
    name:'Cerâmica marrom, porta e janela gradeadas', point:6, refs:[[6,2],[7,3]], color:'#8f8065', base:'#817255', pattern:'brown-tile', wear:.35, height:57,
    openings:[door(.08,.15,{color:'#b1ad85',grille:'scroll',bars:'#b6b991'}),window(.45,.40,{color:'#777c59',grille:'square',bars:'#b8c2a3'})],
  }),
  east('e03-casa-grades-diagonais', 815, 915, {
    name:'Casa creme com grades brancas diagonais', point:7, refs:[[7,3],[7,2],[7,4]], color:'#d9d6b9', base:'#b5b6a0', height:52, detail:'raised-roof',
    openings:[opening('window',.06,.55,.33,.43,{color:'#75755d',grille:'diagonal',bars:'#e1dfc9'}),gate(.67,.28,{color:'#676c56',grille:'chevron',bars:'#e5e2cf'})], paving:'red-checker',
  }),
  east('e04-casa-branca-grade-ornamental', 915, 989, {
    name:'Fachada branca de platibanda, portão ornamentado', point:8, refs:[[7,2],[8,3],[8,4]], color:'#d5d7c8', base:'#b1b7a2', height:65, roof:'hidden-tile', parapet:16, wear:.44,
    openings:[gate(.04,.43,{color:'#626c59',grille:'scroll',bars:'#bfcab2',h:.59}),window(.62,.25,{color:'#61725f',grille:'scroll',bars:'#c6ceba',h:.32,bottom:.25})], steps:true,
  }),
  east('e05-garagem-branca-cinza', 989, 1086, {
    name:'Casa branca com rodapé cinza e garagem', point:8, refs:[[8,3],[8,2],[9,3]], color:'#e1e0d5', base:'#65717a', baseHeight:.29, height:57, wear:.1,
    openings:[shutter(.59,.33,{color:'#dfdfd4',h:.64})], meters:[.43], mailbox:.28,
  }),
  east('e06-casa-verde-trepadeiras', 1086, 1192, {
    name:'Casa verde recuada, grade e trepadeiras', point:9, refs:[[9,3],[9,2],[9,4]], color:'#83aa61', base:'#b9ac8c', baseHeight:.23, height:59, wear:.86, detail:'green-veranda',
    openings:[window(.16,.17,{color:'#576d4b',grille:'star',bars:'#bac6a5'}),door(.40,.16,{color:'#6a8860',grille:'star',bars:'#c6c9ac'}),window(.61,.26,{color:'#627853',grille:'star',bars:'#bac6a5'})],
    fence:{height:34,base:'#aeaa91',color:'#bfccb1',grille:'star',gate:.24}, plants:'vines', dish:true,
  }),
  east('e07-clinica-recuada', 1192, 1300, {
    name:'Clínica com fachada malva e pátio', point:10, refs:[[9,2],[10,3],[10,4]], color:'#9c9194', base:'#9c9194', baseHeight:0, height:64, roof:'flat', detail:'mauve-clinic', frontSetback:38, wear:.08,
    openings:[door(.29,.19,{color:'#865b3a',wood:true,h:.61}),window(.59,.07,{color:'#55726b',grille:'horizontal',h:.31,bottom:.24}),window(.77,.07,{color:'#55726b',grille:'horizontal',h:.31,bottom:.24})],
    signs:[sign(.04,.49,.21,.13,'ODONTOLOGIA',{color:'#76523d',ink:'#cab489'})], pots:3, paving:'cream-tile',
  }),
  east('e08-duas-garagens-azulejo', 1300, 1390, {
    name:'Azulejo bege com dois portões', point:11, refs:[[10,2],[11,3],[11,4]], color:'#d3cbb6', base:'#b7b199', baseHeight:0, pattern:'small-tile', roof:'hidden-tile', parapet:12, height:62,
    openings:[gate(.06,.36,{color:'#c4c8b8',solid:1,grille:'vertical',h:.64}),gate(.58,.34,{color:'#c4c8b8',solid:1,grille:'vertical',h:.64})],
  }),
  east('e09-casa-amarela-descascada', 1390, 1498, {
    name:'Casa amarela descascada com base salmão', point:11, refs:[[11,3],[11,2],[12,3]], color:'#dbd0ad', base:'#b97e6a', baseHeight:.28, height:63, roof:'hidden-tile', parapet:9, wear:.8, trim:'curved',
    openings:[gate(.05,.37,{color:'#78603d',grille:'scroll',bars:'#444837',recess:true}),window(.67,.24,{color:'#987b4c',grille:'vertical',bars:'#4c4a38'})],
  }),
  // 1498–1599: lote demolido, aberto até os fundos, com laterais de tijolo.
  east('e10-casa-bege-varanda', 1599, 1702, {
    name:'Casa bege com varanda gradeada e porta de enrolar', point:13, refs:[[12,2],[13,3],[13,4]], color:'#c9baa5', base:'#bba58d', roof:'hidden-tile', parapet:10, height:63, wear:.29,
    openings:[shutter(.06,.19,{color:'#c6c9c0',h:.66}),opening('porch',.32,.65,0,.72,{color:'#666d5b',grille:'vertical',bars:'#d8dcc8',recess:true,solid:.10})], trim:'white-line',
  }),
  east('e11-casa-verde-clara', 1702, 1774, {
    name:'Casa verde clara, portão preto e janela', point:14, refs:[[13,2],[14,3]], color:'#bdd1b9', base:'#a8bfa4', height:52, wear:.15, pattern:'horizontal-base',
    openings:[gate(.04,.45,{color:'#35433b',grille:'vertical',bars:'#27372d',solid:.12}),window(.65,.23,{color:'#78503d',grille:'vertical',bars:'#394737'})],
  }),
  east('e12-casa-azulejo-losangos', 1774, 1845, {
    name:'Azulejos creme e ocre em losangos', point:14, refs:[[14,3],[14,2]], color:'#d4c9a8', base:'#b9ac8c', baseHeight:0, pattern:'diamond-tile', height:56, wear:.14,
    openings:[door(.08,.24,{color:'#ac9e77',wood:true,grille:'scroll',bars:'#695c42'}),window(.57,.30,{color:'#a4966f',wood:true,grille:'scroll',bars:'#695c42'})],
  }),
  east('e13-muro-cinza-garagem', 1845, 1993, {
    name:'Muro cinza com garagem branca e porta', point:15, refs:[[15,3],[15,2],[15,4]], color:'#a7a699', base:'#898e7c', height:61, roof:'courtyard', wear:.59,
    openings:[gate(.05,.36,{color:'#cdd0c2',solid:1,grille:'vertical',h:.61}),door(.87,.095,{color:'#cdd0c2',solid:1,grille:'vertical',h:.67})], trim:'garage-lintel', meters:[.71,.78],
  }),
  east('e14-casa-branca-frisos', 1993, 2166, {
    name:'Casa branca de duas janelas e varanda lateral', point:16, refs:[[16,3],[16,2],[17,3]], color:'#dfdbc7', base:'#9daba2', baseHeight:.26, pattern:'horizontal', roof:'hidden-tile', parapet:13, height:62, wear:.43,
    openings:[window(.14,.13,{color:'#776248',wood:true,grille:'scroll',bars:'#384b3e'}),window(.44,.13,{color:'#776248',wood:true,grille:'scroll',bars:'#384b3e'}),opening('porch',.70,.28,0,.77,{color:'#3c493d',grille:'diamond',bars:'#334339',solid:.43})], porchStart:.70, dish:true,
  }),
  east('e15-autoescola-bom-pastor', 2166, 2288, {
    name:'Autoescola Bom Pastor', point:17, refs:[[17,3],[17,2],[17,1]], color:'#df792e', base:'#df792e', baseHeight:0, height:122, roof:'flat', pattern:'orange-tile', detail:'school', wear:.12,
    openings:[opening('window',.10,.23,.17,.22,{color:'#bdb5b4',grille:'square',bars:'#9a9c94'}),opening('window',.46,.20,.17,.22,{color:'#bdb5b4',grille:'square',bars:'#9a9c94'}),opening('door',.77,.18,0,.43,{color:'#9db7b5',glass:true,frame:'#b1bab1'}),opening('window',.06,.29,.73,.23,{color:'#b9c4be',grille:'horizontal',bars:'#d4d8c8',projecting:true})],
    signs:[sign(.05,.42,.91,.075,'AUTO ESCOLA BOM PASTOR',{ink:'#e3dfd0',shadow:true}),sign(.20,.515,.66,.035,'DIRECIONANDO CAMINHOS',{ink:'#554e48'}),sign(.43,.14,.52,.040,'1ª HABILITAÇÃO A/B',{ink:'#554e48'}),sign(.43,.19,.52,.040,'ADIÇÃO DE CATEGORIA',{ink:'#554e48'}),sign(.43,.24,.52,.040,'MUDANÇA DE CATEGORIA',{ink:'#554e48'})],
  }),
];

export const specialBuildings = [
  east('pavilion', 264, 380, { x:253, depth:102, name:'Pavilhão amarelo da praça', point:3, refs:[[3,3],[2,2],[4,3]], color:'#dcca80', base:'#b7ad85', height:43, roof:'tile', detail:'pavilion', openings:[window(.14,.16,{color:'#8f9b7c',grille:'square',bars:'#abb094',h:.31}),door(.46,.18,{color:'#a6a590',grille:'vertical'}),window(.79,.10,{color:'#93997c',grille:'square',h:.31})], wear:.33, portico:true }),
  east('cinema', -42, 170, { x:412, depth:132, name:'Antigo cinema, aberturas vedadas', point:1, refs:[[1,3],[2,3],[3,4]], color:'#cfc7b0', base:'#b1aa91', baseHeight:.10, height:91, roof:'flat', detail:'cinema', wear:.82, trim:'cinema', openings:[.13,.33,.56,.77].map(u=>opening('bricked',u,.065,.14,.21,{color:'#c3b49a'})).concat([opening('bricked',.20,.12,.57,.13,{color:'#a58463'}),opening('bricked',.73,.12,.57,.13,{color:'#a17a56'})]) }),
  west('corner-wall', 2410, 2515, { name:'Muro branco além da esquina', point:17, refs:[[17,1],[17,8]], color:'#cbc7b2', base:'#aaa68d', height:43, roof:'courtyard', wear:.65 }),
  east('corner-shop', 2410, 2515, { name:'Chaves e carimbos do outro lado da esquina', point:17, refs:[[17,1],[17,2]], depth:150,color:'#684252',base:'#435f6c',height:59,roof:'hidden-tile',parapet:9,wear:.22,openings:[door(.15,.23,{color:'#283e3c',open:true}),window(.59,.22,{color:'#384944',grille:'vertical'})],signs:[sign(.07,.18,.84,.12,'HM',{ink:'#ddae62'}),sign(.42,.37,.51,.08,'CHAVES E CARIMBOS',{ink:'#d7bd80'})] }),
];

export const gardenWall = { x:-81, y:341, length:411, height:34, gateY:678, gateWidth:23, sealedY:728, refs:[[4,7],[5,7],[6,7]] };
export const demolitionLot = { x:80, y:1498, depth:187, length:101, refs:[[12,3],[12,2]] };
export const brickRecess = { x:-236, y:1682, depth:151, length:57, refs:[[13,7],[14,6]] };
export const flowerShrubs = [{x:109,y:487,r:17},{x:218,y:397,r:15},{x:316,y:333,r:13}];
export const bins = [{x:69,y:1184,kind:'box'},{x:69,y:1775},{x:69,y:1992},{x:69,y:2152,kind:'wire'},{x:-71,y:2260,kind:'wire'}];
