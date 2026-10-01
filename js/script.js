/* =========================================================
   BIRTHDAY SURPRISE
   INDEX PAGE
========================================================= */


/* =========================================================
   ELEMENT
========================================================= */

const giftSection =
    document.getElementById("gift-section");

const archerySection =
    document.getElementById("archery-section");

const giftBox =
    document.getElementById("gift-box");

const transitionOverlay =
    document.getElementById("transition-overlay");

const particles =
    document.getElementById("particles");

const arrow =
    document.getElementById("arrow");

const bowString =
    document.getElementById("bow-string");

const success =
    document.getElementById("archery-success");

const heart =
    document.getElementById("target-heart");


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    const symbols = [
        "✦",
        "✧",
        "♡",
        "·",
        "✿"
    ];

    for (let i = 0; i < 40; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "particle";

        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.fontSize =
            Math.random() * 10 + 8 + "px";

        particle.style.animationDuration =
            Math.random() * 10 + 8 + "s";

        particle.style.animationDelay =
            Math.random() * 10 + "s";

        particles.appendChild(
            particle
        );
    }
}

createParticles();


/* =========================================================
   GIFT
========================================================= */

let giftOpened = false;


function openGift() {

    if (giftOpened) {
        return;
    }

    giftOpened = true;

    giftBox.classList.add(
        "opening"
    );


    /* Cahaya */

    setTimeout(() => {

        transitionOverlay.classList.add(
            "show"
        );

    }, 850);


    /* Pindah scene */

    setTimeout(() => {

        giftSection.classList.remove(
            "active"
        );

        archerySection.classList.add(
            "active"
        );

    }, 1450);


    /* Hilangkan overlay */

    setTimeout(() => {

        transitionOverlay.classList.remove(
            "show"
        );

    }, 2200);
}


/* =========================================================
   CLICK KADO
========================================================= */

giftBox.addEventListener(
    "click",
    openGift
);


/* =========================================================
   KEYBOARD KADO
========================================================= */

giftBox.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openGift();
        }
    }
);


/* =========================================================
   ARCHERY
========================================================= */

let dragging = false;

let startX = 0;
let startY = 0;

let currentPull = 0;

let arrowFinished = false;


/*
    Tarikan maksimum
*/

const MAX_PULL = 130;


/*
    Minimal tarikan
    supaya panah bisa ditembak
*/

const MIN_PULL = 45;


/* =========================================================
   POINTER DOWN
========================================================= */

arrow.addEventListener(
    "pointerdown",
    function (event) {

        if (
            !archerySection.classList.contains(
                "active"
            )
        ) {
            return;
        }

        if (arrowFinished) {
            return;
        }

        event.preventDefault();

        dragging = true;

        startX =
            event.clientX;

        startY =
            event.clientY;

        currentPull = 0;

        arrow.style.transition =
            "none";

        try {

            arrow.setPointerCapture(
                event.pointerId
            );

        } catch (error) {

            /*
                Beberapa browser lama
                tidak mendukung capture.
            */

        }
    }
);


/* =========================================================
   POINTER MOVE
========================================================= */

window.addEventListener(
    "pointermove",
    function (event) {

        if (!dragging) {
            return;
        }

        updateArrow(
            event.clientX,
            event.clientY
        );
    }
);


/* =========================================================
   POINTER UP
========================================================= */

window.addEventListener(
    "pointerup",
    function () {

        if (!dragging) {
            return;
        }

        releaseArrow();
    }
);


/* =========================================================
   POINTER CANCEL
========================================================= */

window.addEventListener(
    "pointercancel",
    function () {

        if (!dragging) {
            return;
        }

        releaseArrow();
    }
);


/* =========================================================
   UPDATE ARROW
========================================================= */

function updateArrow(clientX, clientY) {

    /*
        Karena panah ditarik secara diagonal ke kiri-bawah,
        kita hitung tarikannya berdasarkan
        pergerakan X (ke kiri) dan Y (ke bawah).
    */

    const deltaX = startX - clientX;
    const deltaY = clientY - startY; // Karena Y bertambah saat ke bawah

    // Gunakan rata-rata atau proyeksi sederhana untuk tarikan diagonal
    const distance = (deltaX + deltaY) * 0.7;


    /*
        Hanya izinkan tarikan ke kiri.
    */

    currentPull =
        Math.max(
            0,
            Math.min(
                distance,
                MAX_PULL
            )
        );


    /*
        Panah bergerak ke kiri.
    */

    arrow.style.transform =
        `translateX(${-currentPull}px)`;


    /*
        Tali busur ikut tertarik.

        Semakin jauh panah ditarik,
        titik tengah tali semakin ke kiri.
    */

    const stringPull =
        20 - currentPull;

    bowString.setAttribute(
        "d",
        `
        M 20 20
        Q ${stringPull} 150 20 280
        `
    );
}


/* =========================================================
   RELEASE ARROW
========================================================= */

function releaseArrow() {

    dragging = false;


    /*
        Kalau belum cukup ditarik,
        panah kembali ke posisi awal.
    */

    if (currentPull < MIN_PULL) {

        resetArrow();

        return;
    }


    /*
        Panah ditembak.
    */

    shootArrow();
}


/* =========================================================
   RESET ARROW
========================================================= */

function resetArrow() {

    arrow.style.transition =
        "transform .45s cubic-bezier(.2,.8,.2,1)";

    arrow.style.transform =
        "translateX(0)";


    bowString.setAttribute(
        "d",
        "M 20,20 L 20,280"
    );


    currentPull = 0;
}


/* =========================================================
   SHOOT ARROW
========================================================= */

function shootArrow() {

    if (arrowFinished) {
        return;
    }

    arrowFinished = true;


    /*
        Lepaskan tali.
    */

    bowString.setAttribute(
        "d",
        "M 20,20 L 20,280"
    );


    /*
        Animasi panah melesat
        ke arah kanan.
    */

    arrow.style.transition =
        "transform .35s ease-in";

    // Hitung jarak SVG agar presisi
    const bowContainer = document.getElementById("bow-container");
    const bowWidth = bowContainer.clientWidth || 200;
    
    // Konversi jarak layar ke unit koordinat SVG (viewBox lebar 200)
    const svgDistance = (window.targetDistance / bowWidth) * 200;
    
    // Ujung panah berada 80 unit di depan tengah busur.
    // Kurangi jaraknya agar menancap pas di tengah hati.
    const finalTranslate = svgDistance - 65; 

    arrow.style.transform =
        `translateX(${finalTranslate}px)`;


    /*
        Setelah panah terbang,
        tampilkan efek mengenai hati.
    */

    setTimeout(() => {

        arrowHitHeart();

    }, 350);
}


/* =========================================================
   ARROW HIT HEART
========================================================= */

function arrowHitHeart() {

    // Tambahkan efek getaran sesaat setelah menancap
    const arrowVibration = document.getElementById("arrow-vibration");
    if (arrowVibration) {
        arrowVibration.classList.add("vibrating");
    }

    // Panah tidak dihilangkan agar terlihat menancap.


    /*
        Hentikan heartbeat.
    */

    heart.style.animation =
        "none";


    /*
        Efek hati terkena.
    */

    heart.style.transform =
        "rotate(-45deg) scale(1.35)";

    const instruction = document.querySelector(".archery-instruction");
    if(instruction) instruction.style.opacity = "0";

    // Jangan hilangkan bowContainer agar panah tetap terlihat menancap
    // const bowContainer = document.getElementById("bow-container");
    // if(bowContainer) bowContainer.style.opacity = "0";

    /*
        Kembalikan sedikit
        setelah efek pertama.
    */

    setTimeout(() => {

        heart.style.transition =
            "transform .3s ease";

        heart.style.transform =
            "rotate(-45deg) scale(1.08)";

    }, 180);


    /*
        Tampilkan success.
    */

    setTimeout(() => {

        success.classList.add(
            "show"
        );

        createHeartExplosion();

    }, 450);


    /*
        Masuk ke halaman harapan.
    */

    setTimeout(() => {

        goToUcapan();

    }, 3000);
}


/* =========================================================
   HEART EXPLOSION
========================================================= */

function createHeartExplosion() {

    const symbols = [
        "❤️",
        "💗",
        "💕",
        "✨",
        "✦",
        "🌸"
    ];


    for (let i = 0; i < 35; i++) {

        const item =
            document.createElement("span");


        item.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        item.style.position =
            "fixed";


        item.style.left =
            "50%";


        item.style.top =
            "38%";


        item.style.zIndex =
            "2000";


        item.style.fontSize =
            Math.random() * 15 + 10 + "px";


        item.style.pointerEvents =
            "none";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            Math.random() * 300 + 100;


        const x =
            Math.cos(angle) *
            distance;


        const y =
            Math.sin(angle) *
            distance;


        item.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) scale(0)",

                    opacity: 1
                },

                {
                    transform:
                        `translate(
                            calc(-50% + ${x}px),
                            calc(-50% + ${y}px)
                        )
                        scale(1.3)`,

                    opacity: 0
                }
            ],
            {
                duration:
                    Math.random() * 900 + 900,

                easing:
                    "cubic-bezier(.2,.8,.2,1)",

                fill:
                    "forwards"
            }
        );


        document.body.appendChild(
            item
        );


        setTimeout(() => {

            item.remove();

        }, 2000);
    }
}


/* =========================================================
   GO TO HARAPAN
========================================================= */

function goToUcapan() {

    transitionOverlay.classList.add(
        "show"
    );


    setTimeout(() => {

        window.location.href =
            "ucapan.html";

    }, 900);
}
/* =========================================================
   AIM BOW AUTOMATICALLY
========================================================= */

function aimBow() {
    const bow = document.getElementById("bow-container");
    const heartCont = document.querySelector(".heart-container");
    
    if (!bow || !heartCont) return;

    // Ambil posisi tengah busur
    const bowRect = bow.getBoundingClientRect();
    const bowX = bowRect.left + bowRect.width / 2;
    const bowY = bowRect.top + bowRect.height / 2;

    // Ambil posisi tengah hati
    const heartRect = heartCont.getBoundingClientRect();
    const heartX = heartRect.left + heartRect.width / 2;
    const heartY = heartRect.top + heartRect.height / 2;

    // Hitung sudut dan jarak
    const dy = heartY - bowY;
    const dx = heartX - bowX;
    
    window.targetDistance = Math.sqrt(dx * dx + dy * dy);
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Terapkan rotasi
    bow.style.transform = `rotate(${angle}deg)`;
}

window.addEventListener("resize", aimBow);

// Panggil beberapa kali di awal saat elemen mungkin baru dirender (misal transisi)
setTimeout(aimBow, 50);
setTimeout(aimBow, 500);
setTimeout(aimBow, 1500);
