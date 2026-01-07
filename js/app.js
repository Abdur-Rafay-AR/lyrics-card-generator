document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const fetchBtn = document.getElementById('fetch-spotify');
    const spotifyUrlInput = document.getElementById('spotify-url');
    const colorCardInput = document.getElementById('color-card');
    const colorTextInput = document.getElementById('color-text');
    const rect = document.getElementById('rect');
    const textName = document.getElementById('text-name');
    const textAuthor = document.getElementById('text-author');
    const textLyric = document.getElementById('text-lyric');
    const borderInput = document.getElementById('border');
    const gradientToggle = document.getElementById('gradient-toggle');
    const gradientOptions = document.getElementById('gradient-options');
    const gradientColor1 = document.getElementById('gradient-color1');
    const gradientColor2 = document.getElementById('gradient-color2');
    const gradientAngle = document.getElementById('gradient-angle');
    const downloadBtn = document.getElementById('download');
    const cardSizeSelect = document.getElementById('card-size');
    const customOptions = document.getElementById('custom-size-options');
    const customWidth = document.getElementById("custom-width");
    const customHeight = document.getElementById("custom-height");
    const logoToggle = document.getElementById('logo-toggle');
    const spotifyBranding = document.getElementById('spotify-branding');
    const spotifyLogoIcon = document.getElementById('spotify-logo-icon');
    const spotifyWordmark = document.getElementById('spotify-wordmark');
    const editModeToggle = document.getElementById('edit-mode-toggle');
    const resetLayoutBtn = document.getElementById('reset-layout');
    const themeToggle = document.getElementById('theme-toggle');
    const pickFileInput = document.getElementById('pick-file');

    // Font Inputs
    const fontSizeTitle = document.getElementById('font-size-title');
    const fontSizeAuthor = document.getElementById('font-size-author');
    const fontSizeLyrics = document.getElementById('font-size-lyrics');

    // --- State ---
    let isEditMode = false;

    // --- Spotify Fetch Logic ---
    fetchBtn.addEventListener('click', function() {
        var url = spotifyUrlInput.value;
        if (!url) return alert("Please enter a Spotify URL");

        // Extract Track ID
        var trackIdMatch = url.match(/track\/([a-zA-Z0-9]+)/);
        if (!trackIdMatch) return alert("Invalid Spotify Track URL");
        var trackId = trackIdMatch[1];
        
        // Fetch the Spotify Embed page via proxy
        var embedUrl = 'https://open.spotify.com/embed/track/' + trackId;
        var proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(embedUrl);

        fetch(proxyUrl)
            .then(response => {
                if (response.ok) return response.text();
                throw new Error('Network response was not ok.');
            })
            .then(html => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, "text/html");
                
                var nextDataScript = doc.getElementById("__NEXT_DATA__");
                if (nextDataScript) {
                    var json = JSON.parse(nextDataScript.innerText);
                    var entity = json.props.pageProps.state.data.entity;
                    
                    var title = entity.name;
                    var artist = entity.artists.map(a => a.name).join(", ");
                    var thumbnail = entity.visualIdentity?.image?.[0]?.url;

                    // Extract Color
                    var hexColor = null;
                    if (entity.visualIdentity && entity.visualIdentity.backgroundBase) {
                        var r = entity.visualIdentity.backgroundBase.red;
                        var g = entity.visualIdentity.backgroundBase.green;
                        var b = entity.visualIdentity.backgroundBase.blue;
                        hexColor = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                    }

                    updateCard(title, artist, thumbnail, hexColor);
                } else {
                    console.log("Next.js data not found, trying meta tags");
                    var title = doc.querySelector('.TitleAndSubtitle_title__Nwyku a')?.innerText || "Unknown Song";
                    var artist = doc.querySelector('.TitleAndSubtitle_subtitle__P1cxq a')?.innerText || "Unknown Artist";
                    var thumbnail = doc.querySelector('.CoverArtBase_coverArt__ne0XI')?.style.backgroundImage?.slice(5, -2);
                    
                    if(!thumbnail) thumbnail = "Assets/spotify.svg";

                        updateCard(title, artist, thumbnail);
                }
            })
            .catch(error => {
                console.error('Error fetching Spotify data:', error);
                alert("Failed to fetch data. Be sure to check the URL.");
            });
    });

    function updateCard(title, artist, thumbnail, cardColor) {
        if (thumbnail && thumbnail.startsWith("http")) {
                fetch('https://corsproxy.io/?' + encodeURIComponent(thumbnail))
                .then(res => res.blob())
                .then(blob => {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        var img = document.getElementById('output');
                        img.removeAttribute("crossOrigin"); 
                        img.src = reader.result;
                        // document.getElementById('image-preview').src = reader.result; // Removed preview from UI
                    }
                    reader.readAsDataURL(blob);
                })
                .catch(err => {
                    console.error("Error loading image proxy:", err);
                        document.getElementById('output').src = thumbnail; 
                        // document.getElementById('image-preview').src = thumbnail;
                });
        }

        textName.innerText = title;
        textAuthor.innerText = artist || "Insert Author";

        if (cardColor) {
            colorCardInput.value = cardColor;
            colorCardInput.dispatchEvent(new Event('input'));
        }
    }

    // --- Image Upload Logic ---
    pickFileInput.addEventListener('change', function(event) {
        if(event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('output').src = e.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    // --- Appearance Controls ---
    colorCardInput.addEventListener("input", function () {
        if (!gradientToggle.checked) {
            rect.style.background = this.value;
        }
    });

    colorTextInput.addEventListener("input", function () {          
        textName.style.color = this.value;
        textLyric.style.color = this.value;
        textAuthor.style.color = this.value;
        // If we switch back to SVG logo we might need this, but for PNG logo it's irrelevant
    }); 

    borderInput.addEventListener("input", function () {
        rect.style.borderRadius = this.value +"px";
    });

    // Font Sizes
    fontSizeTitle.addEventListener("input", function() {
        textName.style.fontSize = this.value + "px";
    });
    
    fontSizeAuthor.addEventListener("input", function() {
        textAuthor.style.fontSize = this.value + "px";
    });

    fontSizeLyrics.addEventListener("input", function() {
        textLyric.style.fontSize = this.value + "px";
    });

    // Gradient
    gradientToggle.addEventListener("change", function () {
        if (this.checked) {
            gradientOptions.style.display = "block";
            applyGradient();
        } else {
            gradientOptions.style.display = "none";
            rect.style.background = colorCardInput.value;
        }
    });
    
    function applyGradient() {
        if (!gradientToggle.checked) return;
        const c1 = gradientColor1.value;
        const c2 = gradientColor2.value;
        const angle = gradientAngle.value || 45;
        rect.style.background = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
    }
    
    gradientColor1.addEventListener("input", applyGradient);
    gradientColor2.addEventListener("input", applyGradient);
    gradientAngle.addEventListener("input", applyGradient);

    // Clean Paste
    function handle_paste(el) {
        el.addEventListener("paste", function(e){
            e.preventDefault();
            var text = e.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
        });
    }
    handle_paste(textName);
    handle_paste(textLyric);
    handle_paste(textAuthor);

    // --- Layout Controls ---
    function updateCardSize() {
        const size = cardSizeSelect.value;
        rect.style.minHeight = "unset";

        if (size === "custom") {
            customOptions.style.display = "flex";
            rect.style.width = customWidth.value + "px";
            rect.style.height = customHeight.value + "px";
        } else {
            customOptions.style.display = "none";
            if (size === "auto") {
                rect.style.width = "500px";
                rect.style.height = "fit-content";
            } else if (size === "square") {
                rect.style.width = "500px";
                rect.style.height = "500px";
            } else if (size === "portrait") {
                rect.style.width = "400px"; 
                rect.style.height = "711px"; 
            } else if (size === "landscape") {
                rect.style.width = "600px";
                rect.style.height = "338px"; 
            }
        }
    }

    cardSizeSelect.addEventListener("change", updateCardSize);
    customWidth.addEventListener("input", updateCardSize);
    customHeight.addEventListener("input", updateCardSize);

    logoToggle.addEventListener("change", function() {
        spotifyBranding.style.display = this.checked ? "flex" : "none";
    });

    // --- Edit Mode ---
    editModeToggle.addEventListener("change", function() {
        isEditMode = this.checked;
        toggleEditMode(isEditMode);
    });

    function toggleEditMode(enable) {
        const elementsToDrag = ["#album-art-container", "#song-text-container", "#text-lyric", "#spotify-branding"];
        
        if (enable) {
            $(elementsToDrag.join(", ")).draggable({
                scroll: false,
                cursor: "move"
            });

            $("#text-lyric").resizable({
                handles: "e, w"
            });

            $("#output").resizable({
                aspectRatio: true,
                handles: "n, e, s, w, se" 
            });

            $(elementsToDrag.join(", ")).addClass('draggable-active');
            
            textName.contentEditable = "false";
            textAuthor.contentEditable = "false";
            textLyric.contentEditable = "false";

        } else {
            try {
                $(elementsToDrag.join(", ")).draggable("destroy");
            } catch(e) {}

            try {
                $("#text-lyric").resizable("destroy");
                $("#output").resizable("destroy");
            } catch(e) {}

            $(elementsToDrag.join(", ")).removeClass('draggable-active');
            
            textName.contentEditable = "true";
            textAuthor.contentEditable = "true";
            textLyric.contentEditable = "true";
        }
    }

    // --- Reset ---
    resetLayoutBtn.addEventListener("click", function() {
        // Reset CSS
        $("#album-art-container").css({top: "", left: "", position: ""}); 
        $("#song-text-container").css({top: "", left: "", position: ""});
        $("#text-lyric").css({top: "", left: "", width: "480px", height: "", position: "relative"});
        $("#spotify-branding").css({top: "", left: "20px", bottom: "20px", right: "", position: "absolute"});
        $("#output").css({width: "80px", height: "80px"});

        // Reset Fonts
        fontSizeTitle.value = 24;
        textName.style.fontSize = "24px";
        fontSizeAuthor.value = 15;
        textAuthor.style.fontSize = "15px";
        fontSizeLyrics.value = 20;
        textLyric.style.fontSize = "20px";
    });

    // --- Download ---
    downloadBtn.addEventListener("click", function () {
        const wasEditMode = editModeToggle.checked;
        if(wasEditMode) {
            toggleEditMode(false);
        }

        html2canvas(document.querySelector("#rect"), { 
            backgroundColor: null, 
            scale: 3,
            useCORS: true
        }).then(canvas => {
            canvas.toBlob(function (blob) {
                var h1content = textName.innerText || "lyric-card";
                var newTitle = h1content.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                if(newTitle.length === 0) newTitle = "lyric_card";
                newTitle += ".png";
                saveAs(blob, newTitle);

                if(wasEditMode) {
                    toggleEditMode(true);
                    editModeToggle.checked = true; // Ensure UI stays synced
                }
            });
        });
    });

    // --- Theme ---
    function applyTheme(isDark) {
        if(isDark){
            document.body.classList.add('dark-mode');
            themeToggle.innerText = "☀️";
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerText = "🌙";
        }
    }

    themeToggle.addEventListener('click', function() {
        var isDark = !document.body.classList.contains('dark-mode');
        applyTheme(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Init Theme
    if(localStorage.getItem('theme') === 'dark'){
        applyTheme(true);
    }
    
    // Init Card Color
    rect.style.backgroundColor = colorCardInput.value;
});
