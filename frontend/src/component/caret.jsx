import React from 'react'

const Caret = (props) => {
    if(props.carets === null)
        return null
    
    const carets = props.carets.map((caret, index) =>{
        var position = caret.position
        if(position.left === 0 && position.right === 0){
            return null
        }
        return (
            <div 
                //title={ caret.socket }
                key={ index } 
                style={{
                    position: 'absolute',
                    left: `${position.left - 2}px`,
                    top: `${position.top - 5}px`,
                }} 
                className="blink"
            >
                |
                <div className="text-hover">
                    { caret.socket }
                </div>
            </div>
        )
    })

    return (
        <div>
            {carets}
        </div>
    )
}

export default Caret