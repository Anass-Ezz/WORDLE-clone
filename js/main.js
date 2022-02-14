let main_word = 'HAPPY'
let game_over = false
let win = false

async function isWord(wordle_word){
    let is_word = false
    await axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/"+wordle_word).then(res=>{
        console.log('valid')
        is_word = true
    }).catch(err=>{
        console.log('invalid')
        is_word = false
    })
    return is_word
}



var guesses_validation = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
]
var guesses = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
]
letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

var tile_container = document.querySelector("#tile-container")

let current_row = 0

let current_tile = 0

function isLetter(key){
    var found = false
    key = key.toUpperCase()
    letters.forEach(letter=>{
        if (!found)
            if (letter == key){
                found = true
            }
    })
    return found
}

function isEmptyRow(row_index){
    var is_empty = true
    guesses[row_index].forEach(tile=>{
        if (tile !== ''){
            is_empty = false
        }
    })
    return is_empty
}
function containsEmptyStr(row_index){
    var contains_empty= false
    guesses[row_index].forEach(tile=>{
        if (tile === ''){
            contains_empty = true
        }
    })
    
    return contains_empty
}

function getRowWord(row_index){
    let word
    word = guesses[row_index][0] + guesses[row_index][1] + 
    guesses[row_index][2] + guesses[row_index][3] + 
    guesses[row_index][4]
    return word
}



guesses.forEach((guess_row, row_index)=>{
    guess_row_element = document.createElement('div');
    guess_row_element.setAttribute("id", "guess-row-"+row_index)
    guess_row_element.classList.add("guess-row")
    tile_container.append(guess_row_element)
    guess_row.forEach((guess, guess_index)=>{
        tile_element = document.createElement("div")
        tile_element.setAttribute("id","row-"+row_index +"-tile-"+guess_index)
        tile_element.setAttribute("class","row-"+row_index +"-tile")
        tile_element.classList.add("tile")
        guess_row_element.append(tile_element)
    })
})
function getTileElement(row_index, tile_index){
    return document.querySelector("#row-"+row_index+"-tile-"+tile_index)
}
function getRowElement(row_index){
    return document.querySelector("#guess-row-"+row_index)
}

function updateTiles(row_index, refresh){
    if(!refresh){
        var tile_elements = document.querySelectorAll('.row-' + row_index + '-tile')
        tile_elements.forEach((tile_element, tile_index)=>{
            validation = guesses_validation[row_index][tile_index]
            console.log(validation)
            tile_element.setAttribute(validation, '')
        })
    }
    else{
        for(i in guesses_validation){
            var tile_elements = document.querySelectorAll('.row-' + i + '-tile')
            tile_elements.forEach((tile_element, tile_index)=>{
                validation = guesses_validation[row_index][tile_index]
                tile_element.setAttribute(validation, '')
            })
        }
    }
}

// get triggered when refresh page
// updateTiles(current_row, true)    


function addLetter(key){
    if (current_tile <= 4 && isLetter(key) && !getTileElement(current_row, current_tile).textContent){
        current_tile_element = getTileElement(current_row, current_tile)
        current_tile_element.textContent = key.toUpperCase()
        current_tile_element.setAttribute("letter", '')
        guesses[current_row][current_tile] = key.toUpperCase()
        current_tile ++
    }
    else if(key == "Backspace" && current_tile > 0 ){
        if (current_tile == 4 && getTileElement(current_row, current_tile).textContent){
            getTileElement(current_row, current_tile).textContent = ''
            getTileElement(current_row, current_tile).removeAttribute("letter")
            guesses[current_row][current_tile] = ''
        }
        else if (current_tile == 4 && ! getTileElement(current_row, current_tile).textContent){
            getTileElement(current_row, (current_tile - 1)).textContent = ''
            getTileElement(current_row, current_tile - 1).removeAttribute("letter")
            guesses[current_row][current_tile-1] = ''
            current_tile --
        }
        else{
            getTileElement(current_row, (current_tile-1)).textContent = ''
            getTileElement(current_row, current_tile - 1).removeAttribute("letter")
            guesses[current_row][current_tile-1] = ''
            current_tile --

        }
    }
    else if(key == "Enter"){
        if(isEmptyRow(current_row) || containsEmptyStr(current_row) ){
            getRowElement(current_row).setAttribute('invalid', '')
            window.setTimeout(()=>{
                getRowElement(current_row).removeAttribute('invalid')
            }, 600)
        }
        
        else{
            isWord(getRowWord(current_row)).then((is_word)=>{
                if (is_word){
                    let word = getRowWord(current_row)
                    for(i in word){
                        if (word[i] == main_word[i]){
                            guesses_validation[current_row][i] = 'correct'
                        }
                        else{
                            guesses_validation[current_row][i] = 'absent'
                        }
                        for(j in main_word){
                            if(word[i] == main_word[j] && guesses_validation[current_row][i] == 'absent')
                            guesses_validation[current_row][i] = 'present'
                        }
                    }
                    current_tile = 0
                    current_row ++ 
                    updateTiles(current_row-1, false)
                    
                    if(word == main_word){
                        game_over = true
                        win = true
                    }
                    else if(current_row == 6){
                        game_over = true
                        win = false
                        
                    }
                    console.log("game over: ", game_over)
                    console.log("is wining: ", win)
                }
                else{
                    getRowElement(current_row).setAttribute('invalid', '')
                    window.setTimeout(()=>{
                        getRowElement(current_row).removeAttribute('invalid')
                    }, 600)
                }
            })

        }
        
    }

}

document.addEventListener("keydown", (e)=>{
    if(!game_over){
        addLetter(e.key)
    }

})

