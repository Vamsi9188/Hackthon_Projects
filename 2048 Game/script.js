        var board;
        var newScore = 0;
        var topScore = localStorage.getItem("topScore") || 0;
        topScore = parseInt(topScore);
        var rows=4;
        var columns=4;
        window.onload = function()
        {
            document.getElementById('topScore').innerText = topScore;
            playGame();
        }

        function playGame()
        {
            document.getElementById('game-over').style.display = "none";
            newScore = 0;
            document.getElementById('score').innerText = newScore;
            board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            document.getElementById('board').innerHTML = "";
            for (let r = 0; r < rows; r++)
                {
                    for (let c = 0; c < columns; c++)
                    {
                        let tile = document.createElement('div');
                        tile.id = r.toString() + "-" + c.toString();
                        let num = board[r][c];
                        updateTile(tile, num);
                        document.getElementById('board').append(tile);
                    }
                }
            setTwo();
            setTwo();
        }
        function updateTile(tile,num)
        {
            tile.innerText="";
            tile.classList.value="";
            tile.classList.add('tile');
            if(num>0)
            {
                tile.innerText=num.toString();
                if(num<=4096)
                {
                    tile.classList.add("x"+num.toString());
                }
                else
                {
                    tile.classList.add('x8192');
                }
            }
        }
        function hasEmptyTile()
        {
            for(let r=0;r<rows;r++)
            {
                for(let c=0;c<columns;c++)
                {
                    if(board[r][c]==0)
                    {
                        return true;
                    }
                }
            }
            return false;
        }
        function setTwo()
        {
            if(!hasEmptyTile())
            {
                return;
            }
            let found=false;
            while(!found)
            {
                let r=Math.floor(Math.random()*rows);
                let c=Math.floor(Math.random()*columns);
                if(board[r][c]==0)
                {
                    board[r][c]=2;
                    let tile=document.getElementById(r.toString() + "-" + c.toString());
                    tile.innerText='2';
                    tile.classList.add('x2');
                    found=true
                }

            }
        }
        function filterZero(row)
        {
            return row.filter((num) => num!=0);
        }
        function slide(row)
        {
            row=filterZero(row);
            for(let i=0;i<row.length-1;i++)
            {
                if(row[i]==row[i+1])
                {
                    row[i] *= 2;
                    row[i+1]=0;
                    newScore += row[i];
                }
            }
            row=filterZero(row);
            while(row.length<columns)
            {
                row.push(0);
            }
            return row;
        }
        function slideLeft()
        {
            for(let r=0;r<rows;r++)
            {
                let row=board[r];
                row=slide(row);
                board[r]=row;
                for(let c=0;c<columns;c++)
                {
                    let tile=document.getElementById(r.toString() + "-" + c.toString());
                    let num=board[r][c]
                    updateTile(tile,num);
                }
            }
        }
        function slideRight()
        {
            for(let r=0;r<rows;r++)
            {
                let row=board[r];
                row.reverse();
                row=slide(row);
                board[r]=row.reverse();
                for(let c=0;c<columns;c++)
                {
                    let tile=document.getElementById(r.toString() + "-" + c.toString());
                    let num=board[r][c]
                    updateTile(tile,num);
                }
            }
        }
        function slideUp()
        {
            for(let c=0;c<columns;c++)
            {
                let row=[board[0][c],board[1][c],board[2][c],board[3][c]];
                row=slide(row);
                for(let r=0;r<rows;r++)
                {
                    board[r][c]=row[r];
                    let tile=document.getElementById(r.toString() + "-" + c.toString());
                    let num=board[r][c]
                    updateTile(tile,num);
                }
            }
        }
        function slideDown()
        {
            for(let c=0;c<columns;c++)
            {
                let row=[board[0][c],board[1][c],board[2][c],board[3][c]];
                row.reverse();
                row=slide(row);
                row.reverse();
                for(let r=0;r<rows;r++)
                {
                    board[r][c]=row[r];
                    let tile=document.getElementById(r.toString() + "-" + c.toString());
                    let num=board[r][c]
                    updateTile(tile,num);
                }
            }
        }
        document.addEventListener('keyup',(e) =>
        {
            if(e.code=="ArrowLeft")
            {
                slideLeft();
                setTwo();
            }
            else if(e.code=="ArrowRight")
            {
                slideRight();
                setTwo();
            }
            else if(e.code=="ArrowUp")
            {
                slideUp();
                setTwo();
            }
            else if(e.code=="ArrowDown")
            {
                slideDown();
                setTwo();
            }
            document.getElementById('score').innerText=newScore;
            if(newScore>topScore)
            {
                topScore=newScore;
                localStorage.setItem('topScore',topScore);
                document.getElementById('topScore').innerText=topScore;
            }
            if(!canMove())
            {
                document.getElementById('game-over').style.display='block';
            }
        })
        function canMove()
        {
            for(let r=0;r<rows;r++)
            {
                for(let c=0;c<columns;c++)
                {
                    if(board[r][c]==0)
                    {
                        return true;
                    }
                    if(c<columns-1 && board[r][c]==board[r][c+1])
                    {
                        return true;
                    }
                    if(r<rows-1 && board[r][c]==board[r+1][c])
                    {
                        return true;
                    }
                }
            }
            return false;   
        }
        function newGame()
        {
            playGame();
        }