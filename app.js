// סליחה על זה שהתגובות פה חלקם בעברית וחלקם באנגלית
// קריאה מהנה


$( document ).ready(function() {
  homeFunc()

  //clearing Session Storage if page refreshed =>
  sessionStorage.clear()

})


// public variablers =>

let indexPerRun = 100   // שינוי ערך זה ישנה את כמות האלמנטים המופיעים בהום
let liveReportArr = []  // מערך הטוגלים שנשלח אחרי זה לדוחות
let moreInfoActive = [] // מערך של בוליאנים.
let coinsArr = [] // התגובה של הבקשת גט שלא נצטרך להתעסק מלא בשליחת פרמטרים. פשוט להשוות אותו למערך פאבליק

//=======================

// changes active for menu btn's
const activeBtn = (current)=>{
$('#homeBtn').removeClass('active')
$('#reportBtn').removeClass('active')
$('#aboutBtn').removeClass('active')
current.addClass('active')

if(interval != undefined){    // onCLick this buttons if you were before on live report it will cancel the interval.
  clearInterval(interval)
}
}


let draw = (elm,string)=>{  // drawing html with 2 arguments, div above , string to be drawn.
elm.append(string)
}


const homeFunc = ()=>{
 activeBtn($('#homeBtn'))
liveReportArr = []  // איפוס מערך הטוגלים
coinsResVal = [] // איפוס מערך שני של הדוחות.

// make home btn active
 spinner($('.cont'))
  $.get(`https://api.coingecko.com/api/v3/coins/list`,(coins)=>{
    coinsArr = coins
     $('.cont').empty()
      for (let i = 0; i < indexPerRun; i++) {   
        draw($('.cont'), ` <div class="card ${i}" style="width: 18rem;">
        
        <div class="card-body ${i}">

        <div class="custom-control custom-switch" id="toggle${i}" >
        <input type="checkbox" class="custom-control-input" id="customSwitch${i}" >
        <label class="custom-control-label" for="customSwitch${i}"></label>
        </div>

          <h5 class="card-title">${coins[i].symbol}</h5>
          <p class="card-text">${coins[i].name}</p>
          <button type="button"  id="${i}" class="btn btn-primary">More info</button>
        </div>
      </div>   `) //END OF DRAW
      
      for (let index = 0; index <indexPerRun; index++) {
         moreInfoActive[index] = false         
      }

        //TOGGLE 5 LIVE REPORTS=>          
        toggleFunc(i,coins)
        //===================

    moreInfoFunc(i,coins)
       
      }
    })
    
} //homeFunc END



const toggleFunc = (i,coins)=>{
let toggleBTN = $(`#customSwitch${i}`)[0]

toggleBTN.addEventListener('click',()=>{
    
  if(toggleBTN.checked && liveReportArr.length < 5){  //adding arr

    liveReportArr.push(coins[i]) // adding the object to the array 
    
  }
  else if(liveReportArr.length == 5 && toggleBTN.checked){ //modal 5 reached 
    liveReportArr.push(coins[i])
    modal(i,coins) //calling modal function
    
  }
  else if(!toggleBTN.checked ){  //deletion from array  

    for (let j = 0; j < liveReportArr.length; j++) {  // deletion of this this arr memory
      if(liveReportArr[j] == coins[i]){
        liveReportArr.splice(j,1)
      }              
    }
    
  }
})
  
  

}



let canceldArr = []
let liDom= []

const modal = (i,coins)=>{ 
canceldArr = []
let liClickedOn ;
$('.all').css(`opacity`, 0.3)
  
draw($('.toBeModal'), `<div class="modal" tabindex="-1" role="dialog">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title">you have picked more then five coins!</h5>
    
    </div>
    <div class="modal-body">
      <p>because of maintence problem, you must choose only five currencies.. please pick who to remove</p>
      <ul style ="list-style: none;">
                    
        ${liveReportArr.map((coin)=> `<li>${coin.name}</li>`).join(' ')}
            
      </ul>
    </div>
    <div class="modal-footer">
      
      <button type="button" id="modalSaveBtn" class="btn btn-danger">Save changes</button>
      <button type="button" id="modalCancelBtn" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    </div>
  </div>
</div>
</div>
`)


  $('.modal-body li').click((e)=>{  // modal Deletion event
     liClickedOn = e.target.innerText               
     e.currentTarget.style.opacity = 0.2 
     liDom.push(e.currentTarget)      
    canceldArr.push(liClickedOn)  //dom
    
    

   $('#modalSaveBtn').css('opacity', 1) // save  button enabled
   
  })
   
   $('#modalCancelBtn').click(()=>{

     liDom.forEach((li)=>{
      li.style.opacity = 1 
     })
     
     canceldArr = []
     liDom = []
     liClickedOn = ''
   
    })
   
  
  
  
  const modalClosingSave=()=>{
    $('#modalSaveBtn').click(()=>{ // save button onClick
    
      canceldArr.forEach((cancel,cancelI)=>{
      liveReportArr.forEach((report,reportI)=>{
        
          if(cancel == report.name){
           
            liveReportArr.splice(reportI,1) // מחיקת התא מהמערך
          }

        })
            coinsArr.forEach((coin,coinsI)=>{
              if(coin.name == cancel){

                $(`#customSwitch${coinsI}`)[0].checked = false    // סידור הדום
              }
              
            })

      
      })
      


      if(liveReportArr.length < 6){
        $('.toBeModal').empty()
        $('.all').css(`opacity`, 1)   

      }               
      })}
      modalClosingSave()

}//modal Func ends here

const moreInfoFunc = (i,coins)=>{
$(`#${i}`).click(()=>{

  spinner($(`#${i}`).parent())
  $(`#${i}`).toggle() // הסרת הכפתור זמנית כדי שלא יגרם מצב שיקראו לבקשה גט פעמיים באותו רגע ויקריסו את הדום

  if(!moreInfoActive[i]){
     $.get(`https://api.coingecko.com/api/v3/coins/${coins[i].name} `,(res)=>{
       $('#spinner').remove()
       $(`#${i}`).toggle()  // החזרת הכפתור
       let infoFromStorage = sessionStorage.getItem(`info${i}`)
       let moreInfoDrawing = `
         <div class="info${i}">
         <img src="${res.image.small}" alt="">
        
          <p> current price: </p>
         <ul style="list-style : none;" >
          <li> $ ${res.market_data.current_price.usd} </li>
          <li> € ${res.market_data.current_price.eur} </li>
          <li> ₪ ${res.market_data.current_price.ils} </li>
         </ul>
          </div>`;
      setTimeout(()=>{ 
        sessionStorage.removeItem(`info${i}`)
        // console.log('2 min passed')
      },1000 * 120)
      if (infoFromStorage == null) {
        draw($(`#${i}`).parent(),moreInfoDrawing)
        sessionStorage.setItem(`info${i}`,moreInfoDrawing)
      }
      else{
        draw($(`#${i}`).parent(),sessionStorage.getItem(`info${i}`))
      }

      })
         .fail(()=>{      // if api doesnt have more info
          $(`#${i}`).parent().append(`<div class="deletion">
          <div class="alert alert-danger" role="alert">
          No info were to be found
        </div> </div>`)
          $('#spinner').remove()
          $(`#${i}`).toggle()          
          $(`#${i}`).css('opacity', 0.5)
          $(`#${i}`).attr('disabled',true);     //btn wont be enabled for pressing
          setTimeout(()=>{ $('.deletion').empty()},50*100)                       
          
          moreInfoActive[i] = false
         })
     moreInfoActive[i] = true
   } 
   else
   {
     //here put timeOut for 2 minutes
     $(`#${i}`).toggle()
     $('#spinner').remove()
    $('.info'+i).remove() // removing the info
     moreInfoActive[i] = false
   }                   
     //==========                                                                                                  
}) 
}


$('#searchBtn').click((e)=>{
  e.preventDefault()
let elementId
let searchFor = $('#searchInp').val()

for (let index = 0; index < indexPerRun; index++) {
    if (searchFor == coinsArr[index].symbol) {
      elementId = index
    }    
  }
  if(elementId == undefined){    
  $('.toBeModal').html( `<div id='searchAlert' class="alert alert-danger" role="alert">
  <p>  we couldn't find : ${searchFor} 😔 </p>
  </div>`)
    setTimeout(()=>{$('.toBeModal').empty()},2000)
    $('#searchInp').val("")
  }


  else
  {
    let elementForSearch = document.getElementById(elementId).parentElement
    elementForSearch.scrollIntoView()   //scrolling into view of the searched element
    elementForSearch.style.border = '5px solid lightskyblue'   // הדגשה

    setTimeout(()=>{    // טיימאות למחיקת ההדגשה.
       elementForSearch.style.border = ""
    }, 50*100 )
  }


})

//public vars related to Live Reports
//======
let coinsResVal = [] // יצירת מערך של תגובה של השרת להשוואת המטבעות
let interval; // sets interval as a public variable so it can be deleted from active BTN func
//========

const reportsFunc = ()=>{

  let firstTimeRunIf = true
  let restartLabels = false
  $('.cont').empty()
  activeBtn($('#reportBtn')) //sets the active btn as the reportbtn      
  
  if(liveReportArr.length == 0 ){  // if there is no array
    $('.cont').append(`    <div class="alert alert-danger" role="alert">
    You haven't picked any coins ! 
    please pick some & come back.
    </div>`)
    
  }
  
  else {     
    // עטפתי את כל הבלוק הזה באינטרוול בתוך פונקציה כדיי שאחרי זה אוכל לבטל אותו באון קליק הכפתורי ניווט העליונים.
    let interalFunc =()=>{      
      liveReportArr.forEach((coin)=>{ // the get hapening in the forEach to call it each time with a diffrent coin
        // $('.cont').append(coin.name)     
          spinner($('.cont'))
        $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin.symbol}&tsyms=USD&api_key=da30c3b491bae9b9a9327533ad2b250222298ea33e5f702094cc6cdd67703ef7`,(res)=>{
          // console.log(res)
          $('#spinner').remove()
          if(res.HasWarning && firstTimeRunIf ){  // if there is no info on the coin
            $(`.cont`).append(`<div class="deletion">
            <div class="alert alert-danger" role="alert">
            ${coin.name} has no info to compare.
            </div> </div>`)            
            firstTimeRunIf = false
          }
          else if (!res.HasWarning){
            
            // console.log(res[coin.symbol.toUpperCase()].USD) // access to the value of the usd comprison
            
            
            coinsResVal.push({key:coin.symbol.toUpperCase(),  //יצירת מערך של אובייקטים 
              usdComparison: res[coin.symbol.toUpperCase()].USD
              
            })
            
            graph(coinsResVal)     
           
          }               
        })                        
      })
    }
    interalFunc() // הפעלת הפונקציה
   interval = setInterval(interalFunc,2000) // הגדרת הפונקציה כאינטרוול
  }
  


}
let graph = (coinsResVal)=>{ // פונקציית ציור הגרף
  
  $('.cont').html(`<div class="canvasContainer">
  <canvas id="canvas" ></canvas><div/>`) 
  $('#canvas').css('border', '2px solid black')

  let arrObjGraph = []

//first time run
    let ctx = $('#canvas')[0].getContext('2d') 
    console.log(coinsResVal.map( coin =>{
      return(
      coin.usdComparison)
      
    } )


    // arrObjGraph.push(coinsResVal.map((coin,index)=>{

    //   return(                        
    //     {
    //     label:coin.key,
    //     data:coin.usdComparison,
    //     fill:false,
    //     borderColor:"rgb(75, 192, 192)",
        // lineTension:0.1
        //  }          
     ) //return
// 
   // }
  //  )//map
   // )//push

     
    //=================

// console.log(arrObjGraph[0][0].data, 'arrObjGraph')
// let dataForGraph =[]
//   arrObjGraph[0].forEach( data =>{
//     dataForGraph.push(data)
//   })
// console.log(dataForGraph)
// let labelsDataSets = {
//           labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
//           datasets: dataForGraph
//         }
// console.log(labelsDataSets)

    // arrObjGraph[0].forEach(data => { })
    // let myChart =  new Chart(ctx, {
    //   type:'line',
    //   data : labelsDataSets,
    //   options: ''
    // } )
    
  //   data:{"labels":coinsResVal.map( coin => coin.key),
  //   datasets:[
      
  //   {label:'USD',
  //   data:coinsResVal.map( coin => coin.usdComparison),
  //   fill:false,
  //  borderColor:"rgb(75, 192, 192)",
  //   lineTension:0.1}]}

  //   ,options:{}})       

      
    
      
    
}


const aboutFunc = ()=>{
  $('.cont').empty()
  activeBtn($('#aboutBtn'))
    draw($('.cont'),`<div class="card mb-3" style="max-width:2000px;" >
    <div class="row no-gutters">
    <div class="col-md-4">
    <img src="rick.jpg" id = "card-img" class="card-img" alt="...">
    </div>
    <div class="col-md-8">
    <div class="card-body">
    <h5 class="card-title">Cryptonite project by Netanel Halevi</h5>
    <p class="card-text"> API project only by using jquery </p>
    <p class="card-text"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. At amet quidem sit recusandae voluptas cum quasi est, voluptate ut, optio suscipit expedita laborum non fuga deleniti fugiat repellat consectetur? Quae? </p>
    
    </div>
    </div>
    </div>
    </div>`)// draw end
  
}


const spinner = (elm)=>{            
draw(elm,`<div id="spinner" class="spinner-border m-5" role="status">
<span class="sr-only">Loading...</span>
</div>`)     
}


//parallax effect 
//======================
$(window).scroll(()=>{
let offSet = window.pageYOffset
offSetForCont = offSet *1.5 +'px'
$('.all').css('backgroundPositionY',offSetForCont )
})
//================


  
// הצמדה פונקציות קליק לכפתורים

    $('#homeBtn').click(homeFunc)     
    $('#reportBtn').click(reportsFunc)
    $('#aboutBtn').click(aboutFunc)

    
		