
import React from "react";
import "../index.scss"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white",
    }

    return (
    <div onClick={props.holdDice} style={styles} className="die--face">
        <div className="die--num">
            <img src={props.value} />
        </div>
    </div>
    )
}

