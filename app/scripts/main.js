/*
officials
https://api.myjson.com/bins/d3d61
https://firebasestorage.googleapis.com/v0/b/tema-line.appspot.com/o/json%2Fofficials.json?alt=media&token=aebb8c83-4325-4e4b-98e7-a24ce1f08b62

creators'
https://api.myjson.com/bins/14hazt
https://firebasestorage.googleapis.com/v0/b/tema-line.appspot.com/o/json%2Fcreators.json?alt=media&token=29845552-c3a7-4edd-937a-ca4a15bb7ae8

TO-DOs:
v - Get themes json from remote github pages
v - Create homepage routes
v - Create other pages
v - do theme page
v - fill official page
v - create official pagination
v - do creators part
v - do search page
*/
var loading_screen;
(function(){
  var loading_gif = '/images/loading'+Math.floor((Math.random() * 7))+'.gif';
  var loading_color= ['#607D8B','#795548','#F4511E','#FF3D00','#FBC02D','#43A047','#009688'
    ,'#0097A7', '#039BE5','#3D5AFE','#673AB7','#8E24AA','#D81B60','#E53935'];
  var loading_words = ['Amazing things come to those who wait.',
  'Glorious things are waiting for you. We\'re just getting them ready.',
  'Don\'t wait for the perfect moment. Take the moment and make it perfect',
  'You look nice today','Don\'t wait for opportunity. Create it.',
  'If you spend your whole life waiting for the storm, you\'ll never enjoy the sunshine',
  'A good day to you fine user!', 'You can\'t wait for inspiration. You have to go after it with a club',
  'Have a wonderful day!', '>> 😸😺😸😺😸😺😸 <<','It\'ll get faster overtime 😉'];

  loading_screen = pleaseWait({
    logo: loading_gif,
    backgroundColor: loading_color[Math.floor((Math.random() * loading_color.length))],
    loadingHtml: '<p class="loading-message">'+loading_words[Math.floor((Math.random() * loading_words.length))]+
                  `</p><br /><br />
                  <div class="spinner">
                    <div class="dot1"></div>
                    <div class="dot2"></div>
                  </div>`
  });
})();

//--> fetch theme .json data
var thm_officials={}
    ,thm_creators={}
    ,idx_ofc=[]
    ,idx_crt=[]
    ,idx_all=[],
    cpage='';
const thm_templates= {
  dlink:'http://dl.shop.line.naver.jp/themeshop/v1/products/<THEME_ID>/<DEVICE_PLATFORM>/theme.zip',
  img:{
    0:'https://sdl-shop.line.naver.jp/themeshop/v1/products/<THEME_ID>/ANDROID/en/preview_001_720x1232.png',
    1:'https://sdl-shop.line.naver.jp/themeshop/v1/products/<THEME_ID>/ANDROID/en/preview_002_720x1232.png',
    2:'https://sdl-shop.line.naver.jp/themeshop/v1/products/<THEME_ID>/ANDROID/en/preview_003_720x1232.png',
    3:'https://sdl-shop.line.naver.jp/themeshop/v1/products/<THEME_ID>/ANDROID/en/preview_004_720x1232.png',
    4:'https://sdl-shop.line.naver.jp/themeshop/v1/products/<THEME_ID>/ANDROID/en/preview_005_720x1232.png',
    thumb:'https://sdl-shop.line.naver.jp/themeshop/v1/products/<THEME_ID>/WEBSTORE/icon_136x190.png',
  }
}

function off_ajax(){
  return $.ajax({
            dataType: 'json',
            url: 'https://firebasestorage.googleapis.com/v0/b/tema-line.appspot.com/o/json%2Fofficials.json?alt=media&token=aebb8c83-4325-4e4b-98e7-a24ce1f08b62',
            success: function(a,b,data){
              thm_officials = a;
            }
  });
}
function cre_ajax(){
  return $.ajax({
           dataType: 'json',
           url: 'https://firebasestorage.googleapis.com/v0/b/tema-line.appspot.com/o/json%2Fcreators.json?alt=media&token=29845552-c3a7-4edd-937a-ca4a15bb7ae8',
           success: function(a,b,data){
            thm_creators = a;
           }
  });
}

$.when(off_ajax(),cre_ajax()).done(function(){
  idx_ofc=Object.keys(thm_officials);
  idx_crt=Object.keys(thm_creators);
  idx_all=idx_ofc.concat(idx_crt);

  page.base('/');
  page('*', function(ctx,  next){
    var content = document.querySelector('#content');
    if (ctx.init || cpage==ctx.params[0]) {
       next();
    } else {
      content.classList.add('transition');
      setTimeout(function(){
        next();
      }, 250);
    }
  });
  page('/', showHome);
  page('officials', showOfficials);
  page('creators', showCreators);
  page('search', showSearch);
  page('theme', showTheme);
  page('*', shownotfound);
  page({
    click:true,
    popstate:true,
    dispatch:true,
    decodeURLComponents:true,
    hashbang:false
  });
  // setTimeout(function(){
    loading_screen.finish();
  // },3000);
});

//--> Pages.js
function showHome(ctx) {
  render(ctx, template('home'), !ctx.init);
}

function showOfficials(ctx) {
  render(ctx, template('officials'), !ctx.init);
}

function showCreators(ctx) {
  render(ctx, template('creators'), !ctx.init);
}

function showSearch(ctx) {
  render(ctx, template('search'), !ctx.init);
}
function showTheme(ctx) {
  render(ctx, template('theme'), !ctx.init);
}
function shownotfound(ctx){
  render(ctx, template('notfound'), !ctx.init);
}

function render(ctx, html, hide) {
  var el = document.getElementById('content');
  if (hide) {
    el.classList.add('hide');
    setTimeout(function(){
      el.innerHTML = html;
      fillPage(ctx);
      if(cpage!=ctx.params[0])
        $('.mdl-layout__content').animate({scrollTop:0}, 0, 'swing');
      el.classList.remove('hide', 'transition');
      cpage=ctx.params[0];
    }, 250);
  } else {
    el.innerHTML = html;
    fillPage(ctx);
  }
}

function template(name) {
  return $(`#${name}-page`).html();
}

function fillPage(ctx){
  switch(ctx.params[0]){
    case '/' :
      fillhome();
      break;
    case '/officials':
    case 'officials':
      fillOfficials(ctx.querystring);
      break;
    case '/creators':
    case 'creators':
      fillCreators(ctx.querystring);
      break;
    case '/search':
    case 'search':
      fillSearch(ctx.querystring);
      break;
    case '/theme':
    case 'theme':
      fillTheme(ctx.querystring);
      break;
    default:
      console.log('404!');
  };
}

var ofcRand = Math.floor((Math.random() * 202));
var creRand = Math.floor((Math.random() * 8387));
function fillhome(){
  var itemOfc = '';
  var itemCrt = '';
  var thumb = Array(24);
  for(var i = 0; i<12; i++){
    itemOfc = `
      <a href="/theme?ofc=${i+ofcRand}" class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--4dp theme-card" id="off_${i}">
        <div class="mdl-card__title mdl-card--expand"></div>
        <div class="mdl-card__actions">
          <span class="card-image__themename" id="off_name${i}">${idx_ofc[i+ofcRand]}</span>
        </div>
      </a>`;
    itemCrt =`
      <a href="/theme?crt=${i+creRand}" class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--4dp theme-card" id="cre_${i}">
        <div class="mdl-card__title mdl-card--expand"></div>
            <div class="mdl-card__actions">
              <span class="card-image__themename" id="cre_name${i}">${idx_crt[i+creRand]}</span>
            </div>
      </a>`;
    $('#theme-officials').append(itemOfc);
    $('#theme-creators').append(itemCrt);
    thumb[i]=thm_templates.img.thumb.replace('<THEME_ID>',thm_officials[idx_ofc[i+ofcRand]]);
    thumb[i+12]=thm_templates.img.thumb.replace('<THEME_ID>',thm_creators[idx_crt[i+creRand]]);
    $('#off_'+i).css('background',`url('${thumb[i]}') center / cover`);
    $('#cre_'+i).css('background',`url('${thumb[i+12]}') center / cover`);
    $('#official-link').attr('href','officials?p='+ (Math.floor(ofcRand/24)+1) );
    $('#creators-link').attr('href','creators?p='+ (Math.floor(creRand/24)+1) );
  }
  console.log('Home Filled')
}


function fillOfficials(qs){
  var pg = (qs!='')? qs.split('&')[0].split('='):['p',1];
  var offset = 0;
  if(pg[0]=='p' && !isNaN(pg[1])) {
    offset = (parseInt(pg[1],10)-1)*24;
  }
  var itemOfc = '';
  var thumb = [];
  for(var i=0+offset; i<24+offset && i<idx_ofc.length; i++){
    itemOfc = `
      <a class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--4dp theme-card" id="ofc_${i}" href="/theme?ofc=${i}">
        <div class="mdl-card__title mdl-card--expand"></div>
        <div class="mdl-card__actions">
          <span class="card-image__themename" id="off_name${i}">${idx_ofc[i]}</span>
        </div>
      </a>`;
    $('#theme-officials').append(itemOfc);
    thumb[i]=thm_templates.img.thumb.replace('<THEME_ID>',thm_officials[idx_ofc[i]]);
    $('#ofc_'+i).css('background',`url('${thumb[i]}') center / cover`);
  }

  paginator(pg[1],idx_ofc.length,'officials?');
  console.log('Official Filled');
}

function fillCreators(qs){
  var pg = (qs!='')? qs.split('&')[0].split('='):['p',1];
  var offset = 0;
  if(pg[0]=='p' && !isNaN(pg[1])) {
    offset = (parseInt(pg[1],10)-1)*24;
  }
  var itemCrt = '';
  var thumb = [];
  for(var i=0+offset; i<24+offset && i<idx_crt.length; i++){
    itemCrt = `
      <a class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--4dp theme-card" id="crt_${i}" href="/theme?crt=${i}">
        <div class="mdl-card__title mdl-card--expand"></div>
        <div class="mdl-card__actions">
          <span class="card-image__themename" id="crt_name${i}">${idx_crt[i]}</span>
        </div>
      </a>`;
      $('#theme-creators').append(itemCrt);
      thumb[i]=thm_templates.img.thumb.replace('<THEME_ID>',thm_creators[idx_crt[i]]);
      $('#crt_'+i).css('background',`url('${thumb[i]}') center / cover`);
  }

  paginator(pg[1],idx_crt.length,'creators?');
  console.log('Creators Filled');
}

function fillSearch(qs){
  var qryStr = qs.split('&');
  var qry = qryStr[0].split('=');
  var pg;
  pg = (qryStr.length>1)? qryStr[1].split('='): ['p',1];
  var offset = 0;
  if(qry[0] != 'q'){
    page('/');
    return 'QS ERROR';
  }
  if(pg[0]=='p' && !isNaN(pg[1])){
    offset = (parseInt(pg[1]) - 1 ) * 24;
  }
  qry=qry[1];
  $('input[name=\'sample\']').val(qry);
  $('.mdl-textfield--expandable').addClass('is-focused');
  var result = fuzzy.filter(qry,idx_all);
  if(result.length>0){
    var itemQry = '', ctgr = '',t_idx;
    var thumb = Array(result.length);
    var ofc_len = idx_ofc.length;
    for(var i= 0+offset; i<result.length && i<24+offset;i++){
      if(result[i].index < ofc_len){
        ctgr='ofc';
        t_idx=result[i].index;
      }else{
        ctgr='crt';
        t_idx=result[i].index - ofc_len;
      }
      itemQry = `
        <a class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--4dp theme-card" id="qry_${i}" href="/theme?${ctgr}=${t_idx}">
          <div class="mdl-card__title mdl-card--expand"></div>
          <div class="mdl-card__actions">
            <span class="card-image__themename" id="qry_name${i}">${idx_all[result[i].index]}</span>
          </div>
        </a>`;
      $('#theme-search').append(itemQry);
      thumb[i] = (ctgr=='ofc')?
        thm_templates.img.thumb.replace('<THEME_ID>',thm_officials[idx_ofc[t_idx]]):
        thm_templates.img.thumb.replace('<THEME_ID>',thm_creators[idx_crt[t_idx]]);
      $('#qry_'+i).css('background',`url('${thumb[i]}') center / cover`);
    }
  }
  var searchcount = '<b style="color:#0091EA">Search ';
  searchcount += (result.length > 1)? 'results </b>: ':'result </b>: ';
  searchcount += result.length;
  $('#search-result').html(searchcount);

  paginator(pg[1],result.length,'search?q='+qry+'&');
  console.log('Search Filled');
}

function fillTheme(qs){
  var thm = qs.split('&')[0].split('=');
  if(thm[0] == 'ofc'){
    thm[0] = idx_ofc[thm[1]];
    thm[1] = thm_officials[idx_ofc[thm[1]]];
  }else if(thm[0] == 'crt'){
    thm[0] = idx_crt[thm[1]];
    thm[1] = thm_creators[idx_crt[thm[1]]];
  }else {
    console.error('QS ERROR');
    page('/');
    return 'QS ERROR';
  };
  $('.theme-thumb').attr('src',
    thm_templates.img.thumb.replace('<THEME_ID>', thm[1]));
  $('#theme-name').html(thm[0]);
  for(var i=0;i<5;i++){
    $(`#img-full-${i+1}`).attr('src','/images/dummy/full-preview.png');
  }
  for(var i=0;i<5;i++){
    $(`#img-full-${i+1}`).attr('src',thm_templates.img[i].replace('<THEME_ID>', thm[1]));
  }
  $('.android-button').off();
  $('.ios-button').off();
  $('.android-button').on('click',function(){
    var snackbarContainer = document.querySelector('#toast-download');
    var data = {message: 'Downloading '+thm[0]+' theme Android version...'};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    window.location.replace(
      thm_templates.dlink
      .replace('<THEME_ID>',thm[1])
      .replace('<DEVICE_PLATFORM>','ANDROID'));
  });
  $('.ios-button').on('click',function(){
    var snackbarContainer = document.querySelector('#toast-download');
    var data = {message: 'Downloading "'+thm[0]+'" theme iOS version...'};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    window.location.replace(
      thm_templates.dlink
      .replace('<THEME_ID>',thm[1])
      .replace('<DEVICE_PLATFORM>','IOS'));
  });
  console.log('Theme Filled');
}


function paginator(current_page,total_item,path){
  var itemppg = 24;
  var nextbtn = $('.page-next');
  var prevbtn = $('.page-prev');
  var totalpage = Math.floor(total_item/itemppg)+1;
  if(current_page == 1){
    prevbtn.prop('disabled', true);
  }
  if(current_page==totalpage){
    nextbtn.prop('disabled', true);
  }
  $('.pagination-indicator').html('page '+current_page+'/'+totalpage);
  nextbtn.off();
  prevbtn.off();
  nextbtn.on('click',function(){
    if(current_page==1) prevbtn.prop('disabled', false);
    current_page++;
    page(path+'p='+current_page);
  });
  prevbtn.on('click',function(){
    if(current_page==totalpage) nextbtn.prop('disabled', false);
    current_page--;
    page(path+'p='+current_page);
  });
}



// $('.search-button').on('click',function(){
//   if( $('input[name=\'sample\']').val() != ''){
//     page('/search?q='+$('input[name=\'sample\']').val());
//   }
// });
$('input[name=\'sample\']').on('keyup',function(e){
  var qry = $(this).val().trim();
  if( qry != ''){
    if(e.which==13 ){
      if(qry.length>=3) page('/search?q='+encodeURI(qry));
      else{
        var snackbarContainer = document.querySelector('#toast-download');
        var data = {message: 'Type 3 characters or more..'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      }
    }
  }
});

function toggleDrawer(a){
  document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
  document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
  // var d = document.querySelector('.mdl-layout');
  // d.MaterialLayout.toggleDrawer();
}

function aboutSnackbar(a){
  toggleDrawer();
  var snackbarContainer = document.querySelector('#toast-download');
  var data = {message: 'Author : td0'};
  if(snackbarContainer.className.indexOf('mdl-snackbar--active') === -1)
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}
