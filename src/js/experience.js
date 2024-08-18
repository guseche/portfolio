import data from '../data/experience.json' with {type: "json"}

function printExp(next){
    for (let items = 1; items <= 2; items++) {
        console.log(items)
        document.getElementById(`date_${items}`).textContent = data[0 + Number(next)].date
        document.getElementById(`job-title_${items}`).textContent = data[0 +  Number(next)].position
        document.getElementById(`job-company_${items}`).textContent = data[0 +  Number(next)].company
    
        let index = 0
        console.log(data[0 + next])
        for (const element of document.getElementById(`resp_${items}`).getElementsByTagName('li')) {
            element.textContent = data[0 + Number(next)].activities[index]
            index++
        }
        next++
    }
}

let index = 0;
for(let items = 0;items<data.length/2;items++){

    let btn = document.createElement('button')
    btn.className = 'slider_pagination_btn'
    btn.value = index
    document.getElementById('slider_pagination').appendChild(btn)
    index = index + 2

}

for (const element of document.getElementsByClassName('slider_pagination_btn')) {
    element.onclick = function(e){
        printExp(e.target.value)
    }
}

printExp(0)
