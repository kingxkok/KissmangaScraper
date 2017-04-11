var page = require('webpage').create();
var system = require('system');

//helper
//formatting number
function pad(num) {
    var numStr = String(num);
    var size = numStr.length;
    var s = "000"+num;
    return s.substr(size);
}
//consolelogging
page.onConsoleMessage = function(msg) {
    console.log(msg);
};


var addr = system.args[1];

function run(address){
page.open(address, function(){

            console.log(page.plainText);
        //    load_real();
            var title;
            setTimeout(function(){
                
                console.log('single image page loaded');
                page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(){
                    title = page.evaluate(function(){

                                var t = $('#selectChapter').find(':selected').text();
                                console.log('t is ' + t);
                                if(t!== '') ;
                                else  t =  $('.selectChapter').find(':selected').text();
                                if(t.length()>15)
                                t = t.substr(12);
                                t = t.replace(':','');
                                t = t.replace(/ /g,'');
                                t = t.replace(/\n/g,'');
                                t = t.replace('.','');  
                                t = t.substr(0, t.indexOf("Vol"));
                                  return t;
                            });
                                     
                    console.log(title+'.png');
                    page.render(title+'.png');
                    
                });
                console.log('title is ' + title);
                //changing to all pages
               var sel = page.evaluate(function(){
                    sel = document.querySelector('#selectReadType');
                    sel.selectedIndex = 1;
                    sel.dispatchEvent(new Event("change", {
                    'bubbles': true
                    }));
                    return sel;
                });
                
               
                setTimeout(function(){ 
                    page.render(title+'full.png'); 
                     page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(){
                        page.viewportSize = {
                         width: 1920,
                         height: 1080
                        };
                        var images = page.evaluate(function(){
                            var images =[];
                            function getImgDimensions($i) {
                             return {
                                        top : $i.offset().top,
                                        left : $i.offset().left,
                                        width : $i.width(),
                                        height : $i.height()
                                    }
                            }
                             $('#divImage img').each(function(){
                                var img =getImgDimensions($(this));
                                images.push(img);
                             });
                             return images;
                        });
                        console.log(images.length);
                        
                        
                        console.log('title:'+title);
                        images.forEach(function(imageObj, index, array){
                                page.clipRect = imageObj;
                                var savepath = title+'/'+pad(index+1)+'.png';
                                page.render(savepath);
                        });
                          var prev = page.evaluate(function(){
                             return $("img[title='Prev chapter']").closest('a').attr('href');
                         })
                          run(prev);
                     //     phantom.exit();
                   });

                }
                    , 30000);

            },6000);
        
    });

    
}

run(addr);