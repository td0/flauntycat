/*

TO-DOs:
v - Get themes json from remote github pages
v - Create homepage routes
v - Create other pages
v - do theme page
- fill official page
- create official pagination
- do creators part
- do search page
*/

var loading_gif = '/images/loading'+Math.floor((Math.random() * 7))+'.gif'
var loading_words = ['Amazing things come to those who wait.',
'Glorious things are waiting for you. We\'re just getting them ready.',
'You look nice today',
'Don\'t wait for the perfect moment. Take the moment and make it perfect',
'Don\'t wait for opportunity. Create it.',
'If you spend your whole life waiting for the storm, you\'ll never enjoy the sunshine',
'A good day to you fine user!'];

var loading_screen = pleaseWait({
  logo: loading_gif,
  backgroundColor: '#2E7D32',
  loadingHtml: '<p class="loading-message">'+loading_words[Math.floor((Math.random() * 7))]+
                `</p><br /><br />
                <div class="spinner">
                  <div class="dot1"></div>
                  <div class="dot2"></div>
                </div>`
});

//--> fetch theme .json data
var thm_officials={}
    ,thm_creators={}
    ,idx_ofc=[]
    ,idx_crt=[]
    ,idx_all=[];
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
            url: 'https://raw.githubusercontent.com/td0/floret-snitcher/master/output/officials.json',
            success: function(a,b,data){
              thm_officials = a;
            }
  });
}
function cre_ajax(){
  return $.ajax({
           dataType: 'json',
           url: 'https://raw.githubusercontent.com/td0/floret-snitcher/master/output/creators.json',
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
    if (ctx.init) {
       next();
    } else {
      content.classList.add('transition');
      setTimeout(function(){
        next();  }, 150);
    }
  });
  page('/', showHome);
  page('officials', showOfficials);
  page('creators', showCreators);
  page('search', showSearch);
  page('theme', showTheme);
  page({
    click:true,
    popstate:true,
    dispatch:true,
    decodeURLComponents:true,
    hashbang:true
  });

  loading_screen.finish();
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

function render(ctx, html, hide) {
  $('.mdl-layout__content').animate({scrollTop:0}, 300, 'swing');
  var el = document.getElementById('content');
  if (hide) {
    el.classList.add('hide');
    setTimeout(function(){
      el.innerHTML = html;
      el.classList.remove('hide', 'transition');
      fillPage(ctx);
    }, 150);
  } else {
    el.innerHTML = html;
    setTimeout(function(){
      fillPage(ctx);
    },3000);
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
      <div class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--2dp theme-card" id="off_${i}">
        <div class="mdl-card__title mdl-card--expand"></div>
          <a href="/theme?ofc=${i+ofcRand}">
            <div class="mdl-card__actions">
              <span class="card-image__themename" id="off_name${i}">${idx_ofc[i+ofcRand]}</span>
            </div>
          </a>
      </div>`;
    itemCrt =`
      <div class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--2dp theme-card" id="cre_${i}">
        <div class="mdl-card__title mdl-card--expand"></div>
          <a href="/theme?crt=${i+creRand}">
            <div class="mdl-card__actions">
              <span class="card-image__themename" id="cre_name${i}">${idx_crt[i+creRand]}</span>
            </div>
          </a>
      </div>`;
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
    itemOfc = `<div class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--2dp theme-card" id="ofc_${i}">
        <div class="mdl-card__title mdl-card--expand"></div>
          <a href="/theme?ofc=${i}">
            <div class="mdl-card__actions">
              <span class="card-image__themename" id="off_name${i}">${idx_ofc[i]}</span>
            </div>
          </a>
      </div>`;
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
    itemCrt = `<div class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--2dp theme-card" id="crt_${i}">
        <div class="mdl-card__title mdl-card--expand"></div>
          <a href="/theme?crt=${i}">
            <div class="mdl-card__actions">
              <span class="card-image__themename" id="crt_name${i}">${idx_crt[i]}</span>
            </div>
          </a>
      </div>`;
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
    for(var i= 0+offset; i<result.length && i<24+offset;i++){
      if(result[i].index<214){
        ctgr='ofc';
        t_idx=result[i].index;
      }else{
        ctgr='crt';
        t_idx=result[i].index-214;
      }
      itemQry = `<div class="mdl-cell mdl-cell--2-col mdl-card mdl-shadow--2dp theme-card" id="qry_${i}">
        <div class="mdl-card__title mdl-card--expand"></div>
          <a href="/theme?${ctgr}=${t_idx}">
            <div class="mdl-card__actions">
              <span class="card-image__themename" id="qry_name${i}">${idx_all[result[i].index]}</span>
            </div>
          </a>
        </div>`;
      $('#theme-search').append(itemQry);
      thumb[i] = (ctgr=='ofc')?
        thm_templates.img.thumb.replace('<THEME_ID>',thm_officials[idx_ofc[t_idx]]):
        thm_templates.img.thumb.replace('<THEME_ID>',thm_creators[idx_crt[t_idx]]);
      $('#qry_'+i).css('background',`url('${thumb[i]}') center / cover`);
    }
  }
  var searchcount = '<b style="color:green">Search ';
  searchcount += (result.length > 1)? 'results </b>: ':'result </b>: ';
  searchcount += result.length;
  $("#search-result").html(searchcount);

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
  var nextbtn = $(".page-next");
  var prevbtn = $(".page-prev");
  var totalpage = Math.floor(total_item/itemppg)+1;
  if(current_page == 1){
    prevbtn.prop('disabled', true);
  }
  if(current_page==totalpage){
    nextbtn.prop('disabled', true);
  }
  $(".pagination-indicator").html("page "+current_page+"/"+totalpage);
  nextbtn.off();
  prevbtn.off();
  nextbtn.on('click',function(){
    if(current_page==1) prevbtn.prop('disabled', false);
    current_page++;
    page(path+"p="+current_page);
  });
  prevbtn.on('click',function(){
    if(current_page==totalpage) nextbtn.prop('disabled', false);
    current_page--;
    page(path+"p="+current_page);
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
        var data = {message: 'Please type 3 characters or more..'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      }
    }
  }
});

function toggleDrawer(a){
  $(".mdl-layout__drawer-button").trigger();
}
