document.addEventListener('DOMContentLoaded', function () {
    const fontMI = new FontFace(
        "MaterialIcons",
        "url(/static/font/MaterialIcons-Regular.ttf)",
        {
            style: "normal",
            weight: "400",
            stretch: "condensed",
        },
    );

    const fontMSO = new FontFace(
        "MaterialSymbolsOutlined",
        "url(/static/font/MaterialSymbolsOutlined.ttf)",
        {
            style: "normal",
            weight: "400",
            stretch: "condensed",
        },
    ); 
    
    document.fonts.add(fontMI);
    document.fonts.add(fontMSO);

    setIconsAfterFontsLoaded(fontMI, fontMSO)
});

async function setIconsAfterFontsLoaded(fontMI, fontMSO) {
    await fontMI.load()
    await fontMSO.load()
    document.getElementById("rocket_launch").innerText = "rocket_launch"
}

