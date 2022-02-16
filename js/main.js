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

let main_word = ''
let random_word = ''

let game_over = false

let win = false

let random = true

var tile_container = document.querySelector("#tile-container")
var loading_element = document.querySelector("#loading_page")
var game_element = document.querySelector("#game-container")
var form_1v1 = document.getElementById("word_1v1_form")

var input_focus



function emptyTiles(){
    var empty_tiles = [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
    ]
    guesses = empty_tiles
    guesses_validation = empty_tiles
    current_row = 0
    current_tile = 0
    game_over = false
    win = false
    
    for(i in guesses){
        for(j in guesses[i]){
            document.getElementById("row-"+i+"-tile-"+j).textContent = ''
            document.getElementById("row-"+i+"-tile-"+j).removeAttribute("letter")
            document.getElementById("row-"+i+"-tile-"+j).removeAttribute("correct")
            document.getElementById("row-"+i+"-tile-"+j).removeAttribute("absent")
            document.getElementById("row-"+i+"-tile-"+j).removeAttribute("present")
        }
        // updateTiles(i, false)
    }
}

// emptyTiles()

function handleTuggleSwitch(sw){
    emptyTiles()
    random = !sw.checked
    if (random){
        main_word = random_word
        form_1v1.hidden = true
    }else{
        form_1v1.hidden = false
    }
}

function handle1v1Submit(){
    emptyTiles()
    let word = form_1v1.querySelector("input").value
    form_1v1.querySelector("input").value = ''
    if (!random && word.length == 5){
        main_word = word.toUpperCase()
    
    }else{
        window.alert("ENTER A WORD WITH 5 LETTERES")
    }
}


function handleInputFocus(state){
    input_focus = state
}

let current_row = 0

let current_tile = 0

async function isWord(wordle_word){
    let is_word = false
    try{
        await axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/"+wordle_word).then(res=>{
            is_word = true
        }).catch(err=>{
            is_word = false
        })
        console.log("isWord done")
        return is_word
    }
    catch{
        return false
    }
}


async function generateWord(){
    loading_element.hidden = false
    game_element.hidden = true
    var is_5_len = false
    while(!is_5_len){
        await axios.get("https://random-word-api.herokuapp.com/word?number=1")
        .then(res=>{
            let word = res.data[0]
                // console.log(word)
                if (word.length == 5){
                    isWord(word).then(is_word=>{
                        if (is_word){
                            is_5_len = true
                            random_word = word.toUpperCase()
                            main_word = random_word
                            return "generating done"
                            
                        }
                    })

                }
            }).catch(err=>{
                console.log("error")
            })
    }
}


function game(){

    
    function updateTiles(row_index, refresh){
        if(!refresh){
            var tile_elements = document.querySelector('#guess-row-' + row_index).querySelectorAll(".tile")
            tile_elements.forEach((tile_element, tile_index)=>{
                validation = guesses_validation[row_index][tile_index]
                tile_element.setAttribute(validation, '')
            })
        }
    }


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
    
    function getTileElement(row_index, tile_index){
        return document.querySelector("#row-"+row_index+"-tile-"+tile_index)
    }
    function getRowElement(row_index){
        return document.querySelector("#guess-row-"+row_index)
    }
    
    function updateTiles(row_index, refresh){
        if(!refresh){
            var tile_elements = document.querySelector('#guess-row-' + row_index).querySelectorAll(".tile")
            tile_elements.forEach((tile_element, tile_index)=>{
                validation = guesses_validation[row_index][tile_index]
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
    
    guesses.forEach((guess_row, row_index)=>{
        guess_row_element = document.createElement('div');
        guess_row_element.setAttribute("id", "guess-row-"+row_index)
        guess_row_element.classList.add("guess-row")
        tile_container.append(guess_row_element)
        guess_row.forEach((guess, guess_index)=>{
            tile_element = document.createElement("div")
            tile_element.setAttribute("id","row-"+row_index +"-tile-"+guess_index)
            tile_element.classList.add("tile")
            guess_row_element.append(tile_element)
        })
    })
    
    function handleTyping(key){
        key = key.toUpperCase()
        if (current_tile <= 4 && isLetter(key) && !getTileElement(current_row, current_tile).textContent){
            current_tile_element = getTileElement(current_row, current_tile)
            current_tile_element.textContent = key
            current_tile_element.setAttribute("letter", key)
            guesses[current_row][current_tile] = key
            current_tile ++
        }
        else if(key == "BACKSPACE" && current_tile > 0 ){
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
        else if(key == "ENTER"){
            if(containsEmptyStr(current_row) ){
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
        if(!game_over && !input_focus){
            handleTyping(e.key)
        }
    })
}

if(random){
    generateWord().then(()=>{
        loading_element.hidden = true
        game()
    })
}
else{
    game()
}