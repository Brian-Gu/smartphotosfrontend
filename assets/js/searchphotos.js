
// 1. Search Photos by Voice

try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
}
catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}

function searchVoice() {
    recognition.start();
    recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript;
        console.log(speech)

        var apigClient = apigClientFactory.newClient({apiKey: "klHu4nQYVN1uiHOH1VzEY1hwzuGZ5ORS8gqFnJRq"});
        var params = {"q": speech};
        var body   = {"q": speech};

        apigClient.searchGet(params, body, {})
            .then(function (result) {
                console.log('Success');
                console.log(result);
                showPhotos(result.data.results);
            }).catch(function (result) {
            console.log(result);
            console.log(speech);
        });
    }
}

// References:
// https://medium.com/creative-technology-concepts-code/detect-speech-using-the-web-speech-recognition-api-f28a256394de
// https://betterprogramming.pub/perform-speech-recognition-in-your-javascript-applications-91367b0d0


// 2. Search Photos by Key Word

function searchPhoto() {
    var searchKeys = document.getElementById("searchInput").value;
    console.log(searchKeys);

    var apigClient = apigClientFactory.newClient({apiKey: "klHu4nQYVN1uiHOH1VzEY1hwzuGZ5ORS8gqFnJRq"});
    var params = {"q": searchKeys};
    var body   = {"q": searchKeys};

    apigClient.searchGet(params, body, {})
        .then(function (result) {
            console.log('success');
            console.log(result)
            showPhotos(result.data.results);
        }).catch(function (result) {
        console.log(result);
    });
}
// Note: Make sure to enable API Gateway -> GET -> Integration Request -> "Use Lambda Proxy integration"


// 3. Upload Photo: Display + Upload

var file_name = '';
var file_exts = null;
var encoded_image = null;
var decoded_image = null;

function displayPhoto() {

    var input = document.getElementById("inputFile");
    var preview = document.getElementById("div1");

    file_name = input.files[0].name;
    var name_array = file_name.split(".");
    file_exts = name_array[1];
    file_name = name_array[0] + "_" + Date.now() + '.' + file_exts;

    var reader = new FileReader();
    reader.onload = function (e) {
        var img = document.createElement("img");
        img.src = e.target.result;
        img.width  = 250;
        img.height = 150;
        preview.innerHTML = img.outerHTML;
    }
    reader.readAsDataURL(input.files[0]);    // convert to base64 string
}
// Reference:
// http://jsfiddle.net/LvsYc/
// https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_img_create


function uploadPhoto() {

    var file = document.getElementById("inputFile").files[0];
    var config = {headers:{'Content-Type': file.type , "X-Api-Key": "klHu4nQYVN1uiHOH1VzEY1hwzuGZ5ORS8gqFnJRq"}};

    url = 'https://jejr9vrdh7.execute-api.us-east-1.amazonaws.com/prod/upload/smartphotos/' + file_name
    axios.put(url, file, config).then(response=>{
        alert("Photo Upload Successful!!");
    });

}


// 4. Show Photo Search Results

function showPhotos(res) {
    var newsec = document.getElementById("div1");
    if (typeof(newsec) != 'undefined' && newsec != null){
        while (newsec.firstChild) {
            newsec.removeChild(newsec.firstChild);
        }
    }

    console.log(res)
    if (res.length == 0) {
        var newtext = document.createTextNode("No image");
        newsec.appendChild(newtext);
        var cursec = document.getElementById("div2");
        document.body.insertBefore(newsec, cursec);
    }
    else {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i]);
            var newsec = document.getElementById("div1");
            newsec.style.display = 'inline'
            var newimg = document.createElement("img");
            newimg.src = res[i];
            newimg.width  = 250;
            newimg.height = 150;
            newsec.appendChild(newimg);
            var cursec = document.getElementById("div2");
            document.body.insertBefore(newsec, cursec);
        }
    }
}
