import './BackToTop.css';
import { useRef } from 'react';
export default function BackToTop(){
    const btnBackToTopRef = useRef();
    window.onscroll = function() {
        // let btn_back_to_top = document.getElementById("btn_back_to_top");
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            // btn_back_to_top.style.display = "block";
            btnBackToTopRef.current.style.display = 'block';
        } else {
            // btn_back_to_top.style.display = "none";
            btnBackToTopRef.current.style.display = 'none';
        }
    }

    function topFunction(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    return(
        <button ref={btnBackToTopRef} id="btn_back_to_top" onClick={topFunction}><i id="icon_back_to_top" className="fa-solid fa-up-long"></i></button>
    )
}
