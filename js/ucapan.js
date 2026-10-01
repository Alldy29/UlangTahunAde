/* =====================================================
   ELEMENT
===================================================== */

const heartCanopy =
    document.getElementById("heart-canopy");

const floatingHearts =
    document.getElementById("floating-hearts");

const envelopeWrap =
    document.getElementById("envelope-wrap");

const envelope =
    document.getElementById("envelope");

const letter =
    document.getElementById("letter");


/* =====================================================
   1. MEMBUAT DAUN MEMBENTUK HATI
===================================================== */

const leafColors = [

    "#f47d99",

    "#f68fa8",

    "#ff9fb4",

    "#f7a36d",

    "#f6c45f",

    "#e987a1",

    "#ffb2c3",

    "#df718d"

];


function createHeartLeaves() {

    if (!heartCanopy) {
        return;
    }


    const total = 650;

    const points = [];


    /*
        RUMUS HATI

        x = 16 sin(t)^3

        y =
        13 cos(t)
        - 5 cos(2t)
        - 2 cos(3t)
        - cos(4t)
    */


    for (
        let i = 0;
        i < total;
        i++
    ) {

        const t =
            Math.random()
            *
            Math.PI
            *
            2;


        const scale =
            Math.sqrt(
                Math.random()
            );


        const x0 =
            16 *
            Math.pow(
                Math.sin(t),
                3
            );


        const y0 =

            13 *
                Math.cos(t)

            -

            5 *
                Math.cos(
                    2 * t
                )

            -

            2 *
                Math.cos(
                    3 * t
                )

            -

            Math.cos(
                4 * t
            );


        const x =
            x0 * scale;


        const y =
            y0 * scale;


        points.push({
            x,
            y
        });

    }


    /*
        Tambahan titik luar
        agar bentuk hati lebih jelas.
    */

    for (
        let i = 0;
        i < 150;
        i++
    ) {

        const t =
            (
                i / 150
            )
            *
            Math.PI
            *
            2;


        points.push({

            x:
                16 *
                Math.pow(
                    Math.sin(t),
                    3
                ),

            y:

                13 *
                    Math.cos(t)

                -

                5 *
                    Math.cos(
                        2 * t
                    )

                -

                2 *
                    Math.cos(
                        3 * t
                    )

                -

                Math.cos(
                    4 * t
                )

        });

    }


    /*
        Acak urutan sedikit
    */

    points.sort(
        (a, b) => {

            const da =
                a.y +
                Math.random() * 3;

            const db =
                b.y +
                Math.random() * 3;

            return da - db;

        }
    );


    points
        .forEach(
            (
                point,
                index
            ) => {

                const leaf =
                    document.createElement(
                        "span"
                    );


                /*
                    Konversi titik rumus
                    ke posisi CSS.
                */

                const left =
                    50 +
                    point.x *
                    2.85;


                const top =
                    38 -
                    point.y *
                    2.95;


                const size =
                    Math.random()
                    *
                    13
                    +
                    15;


                const rotate =
                    Math.random()
                    *
                    140
                    -
                    70;


                const delay =
                    1.0
                    +
                    index *
                    0.018
                    +
                    Math.random()
                    * .35;


                const color =
                    leafColors[
                        Math.floor(
                            Math.random()
                            *
                            leafColors.length
                        )
                    ];


                leaf.className =
                    "leaf";


                leaf.style.left =
                    `${left}%`;


                leaf.style.top =
                    `${top}%`;


                leaf.style.setProperty(
                    "--size",
                    `${size}px`
                );


                leaf.style.setProperty(
                    "--rotate",
                    `${rotate}deg`
                );


                leaf.style.setProperty(
                    "--delay",
                    `${delay}s`
                );


                leaf.style.setProperty(
                    "--leaf-color",
                    color
                );


                /*
                    Setiap beberapa daun
                    dibuat seperti bunga kecil.
                */

                if (
                    index % 13 === 0
                ) {

                    leaf.classList.add(
                        "small-flower"
                    );

                }


                heartCanopy.appendChild(
                    leaf
                );

            }
        );

}


createHeartLeaves();


/* =====================================================
   2. FLOATING HEARTS
===================================================== */

function createFloatingHeart() {

    if (!floatingHearts) {
        return;
    }


    const heart =
        document.createElement(
            "span"
        );


    heart.className =
        "floating-heart";


    heart.textContent =
        Math.random() > .35
            ? "♡"
            : "✦";


    heart.style.left =
        `${Math.random() * 100}%`;


    heart.style.fontSize =
        `${Math.random() * 20 + 12}px`;


    heart.style.animationDuration =
        `${Math.random() * 8 + 9}s`;


    heart.style.animationDelay =
        `${Math.random() * 2}s`;


    floatingHearts.appendChild(
        heart
    );


    setTimeout(
        () => {

            heart.remove();

        },
        19000
    );

}


/*
    Beberapa hati langsung muncul
*/

for (
    let i = 0;
    i < 25;
    i++
) {

    setTimeout(
        createFloatingHeart,
        i * 300
    );

}


/*
    Hati baru terus bermunculan
*/

setInterval(
    createFloatingHeart,
    500
);


/* =====================================================
   3. REVEAL KETIKA SCROLL
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const revealObserver =
    new IntersectionObserver(

        (
            entries
        ) => {

            entries.forEach(
                (
                    entry
                ) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );


                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },

        {

            threshold:
                0.12,

            rootMargin:
                "0px 0px -40px 0px"

        }

    );


revealElements.forEach(
    (
        element
    ) => {

        revealObserver.observe(
            element
        );

    }
);


/* =====================================================
   4. BUKA SURAT
===================================================== */

if (
    envelope &&
    envelopeWrap &&
    letter
) {

    envelope.addEventListener(
        "click",
        () => {

            /*
                Kalau sudah dibuka,
                jangan jalankan lagi.
            */

            if (
                envelopeWrap.classList.contains(
                    "open"
                )
            ) {

                return;

            }


            /*
                Buka amplop
            */

            envelopeWrap.classList.add(
                "open"
            );


            /*
                Tunggu animasi
                flap selesai.
            */

            setTimeout(
                () => {

                    letter.classList.add(
                        "open"
                    );


                    letter.setAttribute(
                        "aria-hidden",
                        "false"
                    );


                    /*
                        Scroll otomatis
                        menuju surat.
                    */

                    setTimeout(
                        () => {

                            letter.scrollIntoView({

                                behavior:
                                    "smooth",

                                block:
                                    "center"

                            });

                        },
                        250
                    );

                },
                650
            );

        }
    );


    /*
        Keyboard accessibility
    */

    envelope.addEventListener(
        "keydown",
        (
            event
        ) => {

            if (
                event.key === "Enter"
                ||
                event.key === " "
            ) {

                event.preventDefault();

                envelope.click();

            }

        }
    );

}