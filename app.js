const ShizukuPlugin =
    window.Capacitor?.Plugins?.ShizukuPlugin;



document.addEventListener(
    "DOMContentLoaded",
    () => {

        initNavigation();

        checkShizuku();

        loadDeviceInfo();

    }
);





// =============================
// NAVIGATION
// =============================


function initNavigation() {


    const buttons =
        document.querySelectorAll(
            "nav button"
        );


    const screens =
        document.querySelectorAll(
            ".screen"
        );



    buttons.forEach(button => {


        button.addEventListener(
            "click",
            () => {


                buttons.forEach(
                    b =>
                    b.classList.remove(
                        "active"
                    )
                );


                button.classList.add(
                    "active"
                );



                screens.forEach(
                    screen =>
                    screen.classList.remove(
                        "active"
                    )
                );



                const target =
                    button.dataset.page;



                document
                    .getElementById(target)
                    ?.classList.add(
                        "active"
                    );


            }
        );


    });


}







// =============================
// SHIZUKU
// =============================



async function checkShizuku() {


    const status =
        document.getElementById(
            "shizukuStatus"
        );



    if (!ShizukuPlugin) {


        status.innerHTML =
            "<span></span> Plugin Missing";


        return;

    }



    try {


        const result =
            await ShizukuPlugin.checkStatus();



        if (
            result.available &&
            result.permission
        ) {


            status.innerHTML =
                "<span></span> Shizuku Active";


            status
                .querySelector("span")
                .style.background =
                "#22c55e";



        } else {


            status.innerHTML =
                "<span></span> Permission Needed";


        }



    }

    catch(error) {


        status.innerHTML =
            "<span></span> Offline";


        console.error(error);


    }


}






async function requestShizuku() {


    try {


        await ShizukuPlugin
            .requestPermission();


        showToast(
            "Permission requested"
        );


    }

    catch(error) {


        showToast(
            "Shizuku error"
        );


    }


}







// =============================
// EXECUTOR
// =============================



async function execute(cmd) {


    if (!ShizukuPlugin) {


        showToast(
            "Shizuku unavailable"
        );


        return null;


    }



    try {


        const result =
            await ShizukuPlugin
                .executeCommand({

                    command: cmd

                });



        console.log(result);



        return result;



    }

    catch(error) {


        console.error(error);


        showToast(
            "Command failed"
        );


        return null;


    }


}







// =============================
// PRESET
// =============================



async function runPreset(type) {


    let command = "";



    switch(type) {


        case "performance":

            command =
                `
                settings put global
                window_animation_scale 0.5
                `;

        break;



        case "balanced":

            command =
                `
                settings put global
                window_animation_scale 1
                `;

        break;



        case "gaming":

            command =
                `
                settings put global
                animator_duration_scale 0.5
                `;

        break;



        case "battery":

            command =
                `
                settings put global
                window_animation_scale 1
                `;

        break;


    }



    await execute(
        command.replace(
            /\s+/g,
            " "
        )
    );



    showToast(
        "Profile applied"
    );


}







// =============================
// TOOLS
// =============================



async function changeResolution() {


    const value =
        prompt(
            "Resolution example:\n1080x2400"
        );



    if(!value)
        return;



    const res =
        value.replace(
            "x",
            " "
        );



    await execute(
        `wm size ${res}`
    );


    showToast(
        "Resolution changed"
    );


}





async function changeDpi() {


    const dpi =
        prompt(
            "Input DPI"
        );



    if(!dpi)
        return;



    await execute(
        `wm density ${dpi}`
    );



    showToast(
        "DPI changed"
    );


}






async function animationScale() {


    await execute(
        "settings put global window_animation_scale 0.5"
    );


    await execute(
        "settings put global transition_animation_scale 0.5"
    );


    await execute(
        "settings put global animator_duration_scale 0.5"
    );



    showToast(
        "Animation optimized"
    );


}





async function clearCache() {


    await execute(
        "pm trim-caches 999999999"
    );


    showToast(
        "Cache cleaned"
    );


}







// =============================
// DEVICE INFO
// =============================



async function loadDeviceInfo() {


    if(!ShizukuPlugin)
        return;



    try {


        const info =
            await ShizukuPlugin
                .getDeviceInfo();



        setText(
            "deviceModel",
            info.model
        );


        setText(
            "androidVersion",
            info.android
        );


        setText(
            "ramUsage",
            info.ram
        );


        setText(
            "temperature",
            info.temp
        );


        setText(
            "gpu",
            info.gpu
        );


        setText(
            "gles",
            info.gles
        );


        setText(
            "vulkan",
            info.vulkan
        );



    }

    catch(error) {


        console.log(
            "Device info unavailable"
        );


    }


}






function setText(
    id,
    value
){


    const element =
        document.getElementById(id);



    if(element)
        element.innerText =
            value || "--";


}







// =============================
// TOAST
// =============================



function showToast(message){


    let toast =
        document.getElementById(
            "toast"
        );



    if(!toast){


        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "toast";


        document.body
            .appendChild(
                toast
            );


    }



    toast.innerText =
        message;



    toast.className =
        "show";



    setTimeout(
        () => {

            toast.className =
                "";

        },
        2000
    );


}