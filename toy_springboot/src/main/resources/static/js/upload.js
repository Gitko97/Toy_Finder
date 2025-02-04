var fileData;
var fileMultiData;
var isRun = false;

// Select Upload-Area
const uploadArea = document.querySelector('#uploadArea')

// Select Drop-Zoon Area
const dropZoon = document.querySelector('#dropZoon');

// Loading Text
const loadingText = document.querySelector('#loadingText');

// Slect File Input
const fileInput = document.querySelector('#fileInput');

// Select Preview Image
const previewImage = document.querySelector('#previewImage');

// File-Details Area
const fileDetails = document.querySelector('#fileDetails');

// Uploaded File
const uploadedFile = document.querySelector('#uploadedFile');

// Uploaded File Info
const uploadedFileInfo = document.querySelector('#uploadedFileInfo');

// Uploaded File  Name
const uploadedFileName = document.querySelector('.uploaded-file__name');

// Uploaded File Icon
const uploadedFileIconText = document.querySelector('.uploaded-file__icon-text');

// Uploaded File Counter
const uploadedFileCounter = document.querySelector('.uploaded-file__counter');

// ToolTip Data
const toolTipData = document.querySelector('.upload-area__tooltip-data');

// Images Types
const imagesTypes = [
    "jpeg",
    "png",
    "svg",
    "gif"
];

// Append Images Types Array Inisde Tooltip Data
toolTipData.innerHTML = [...imagesTypes].join(', .');

// When (drop-zoon) has (dragover) Event
dropZoon.addEventListener('dragover', function (event) {
    // Prevent Default Behavior
    event.preventDefault();

    // Add Class (drop-zoon--over) On (drop-zoon)
    dropZoon.classList.add('drop-zoon--over');
});

// When (drop-zoon) has (dragleave) Event
dropZoon.addEventListener('dragleave', function (event) {
    // Remove Class (drop-zoon--over) from (drop-zoon)
    dropZoon.classList.remove('drop-zoon--over');
});

// When (drop-zoon) has (drop) Event
dropZoon.addEventListener('drop', function (event) {
    // Prevent Default Behavior
    event.preventDefault();

    // Remove Class (drop-zoon--over) from (drop-zoon)
    dropZoon.classList.remove('drop-zoon--over');

    // Select The Dropped File
    const file = event.dataTransfer.files[0];
    // Call Function uploadFile(), And Send To Her The Dropped File :)
    uploadFile(file);
});

// When (drop-zoon) has (click) Event
dropZoon.addEventListener('click', function (event) {
    // Click The (fileInput)
    fileInput.click();
});

// When (fileInput) has (change) Event
fileInput.addEventListener('change', function (event) {
    // Select The Chosen File
    const file = event.target.files[0];

    // Call Function uploadFile(), And Send To Her The Chosen File :)
    uploadFile(file);
});

// Upload File Function
function uploadFile(file) {
    fileData = file;
    //console.log(fileData);
    //console.log(typeof (fileData));

    // FileReader()
    const fileReader = new FileReader();
    // File Type
    const fileType = file.type;
    // File Size
    const fileSize = file.size;

    // If File Is Passed from the (File Validation) Function
    if (fileValidate(fileType, fileSize)) {
        // Add Class (drop-zoon--Uploaded) on (drop-zoon)
        dropZoon.classList.add('drop-zoon--Uploaded');

        // Show Loading-text
        loadingText.style.display = "block";
        // Hide Preview Image
        previewImage.style.display = 'none';

        // Remove Class (uploaded-file--open) From (uploadedFile)
        uploadedFile.classList.remove('uploaded-file--open');
        // Remove Class (uploaded-file__info--active) from (uploadedFileInfo)
        uploadedFileInfo.classList.remove('uploaded-file__info--active');

        // After File Reader Loaded
        fileReader.addEventListener('load', function () {
            // After Half Second
            setTimeout(function () {
                // Add Class (upload-area--open) On (uploadArea)
                uploadArea.classList.add('upload-area--open');

                // Hide Loading-text (please-wait) Element
                loadingText.style.display = "none";
                // Show Preview Image
                previewImage.style.display = 'block';

                // Add Class (file-details--open) On (fileDetails)
                fileDetails.classList.add('file-details--open');
                // Add Class (uploaded-file--open) On (uploadedFile)
                uploadedFile.classList.add('uploaded-file--open');
                // Add Class (uploaded-file__info--active) On (uploadedFileInfo)
                uploadedFileInfo.classList.add('uploaded-file__info--active');
            }, 500); // 0.5s

            // Add The (fileReader) Result Inside (previewImage) Source
            previewImage.setAttribute('src', fileReader.result);

            // Add File Name Inside Uploaded File Name
            uploadedFileName.innerHTML = file.name;

            // Call Function progressMove();
            progressMove();
        });

        // Read (file) As Data Url
        fileReader.readAsDataURL(file);
    } else { // Else

        this; // (this) Represent The fileValidate(fileType, fileSize) Function

    };
};

// Progress Counter Increase Function
function progressMove() {
    // Counter Start
    let counter = 0;

    // After 600ms
    setTimeout(() => {
        // Every 100ms
        let counterIncrease = setInterval(() => {
            // If (counter) is equle 100
            if (counter === 100) {
                // Stop (Counter Increase)
                clearInterval(counterIncrease);
            } else { // Else
                // plus 10 on counter
                counter = counter + 10;
                // add (counter) vlaue inisde (uploadedFileCounter)
                uploadedFileCounter.innerHTML = `${counter}%`
            }
        }, 100);
    }, 600);
};


// Simple File Validate Function
function fileValidate(fileType, fileSize) {
    // File Type Validation
    let isImage = imagesTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);

    // If The Uploaded File Type Is 'jpeg'
    if (isImage[0] === 'jpeg') {
        // Add Inisde (uploadedFileIconText) The (jpg) Value
        uploadedFileIconText.innerHTML = 'jpg';
    } else { // else
        // Add Inisde (uploadedFileIconText) The Uploaded File Type
        uploadedFileIconText.innerHTML = isImage[0];
    };

    // If The Uploaded File Is An Image
    if (isImage.length !== 0) {
        // Check, If File Size Is 10MB or Less
        if (fileSize <= 5000000) {
            return true;
        } else { // Else File Size
            return alert('Please Your File Should be 50 Megabytes or Less');
        };
    } else { // Else File Type
        return alert('Please make sure to upload An Image File Type');
    };
};

// :)

//추가이미지 없는경우
$("#btnUpload").unbind("click").bind("click", function () {

    if(isRun === true) {
        return;
    } //중복실행방지

    isRun = true;

    const form =  fileData;
    const data = new FormData();
    data.append('file', form);

    var photoIdarr = new Array();

    //썸네일 이미지 업로드(포인트x)
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/api/photo/upload_image/thumbnail",
        data: data,
        async    : false,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 0,
        "headers": {
            "Authorization": localStorage.getItem("token")
        },
        success: function (data) {
            photoIdarr.push(data.photo_id);
            localStorage.setItem("photoIdarr", JSON.stringify(photoIdarr)); //포토 id 로컬 스토리지에 저장
            console.log(photoIdarr);
        },
        error: function (e) {
            alert("fail");
        }
    });

    //이미지 분석 및 분석 페이지 연결
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "http://3.37.121.205:8000/finder/api/image_file",
        data: data,
        async    : false,
        dataType : "JSON",
        processData: false,
        contentType: false,
        cache: false,
        timeout: 0,
        "headers": {
            "Authorization": localStorage.getItem("token")
        },
        success: function (data) {
            localStorage.setItem("data", JSON.stringify(data)); //분석결과 로컬 스토리지에 저장
            location.href="/analysis";
        },
        error: function (e) {
            alert("fail");
        }
    });
});

//이미지 추가 버튼 클릭시
$("#btnAdd").unbind("click").bind("click", function() {
    if (window.File && window.FileList && window.FileReader) {
        $("#files").on("change", function(e) {
            var files = e.target.files,
                filesLength = files.length;
            $(".modal-body").children(".pip").remove();
            for (var i = 0; i < filesLength; i++) {
                var f = files[i];

                var fileReader = new FileReader();
                fileReader.onload = (function(e) {
                    var file = e.target;
                    $("<span class=\"pip\">" +
                        "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                        "<br/>").insertAfter("#image_field");
                    $(".remove").click(function(){
                        $(this).parent(".pip").remove();
                    });
                });
                fileReader.readAsDataURL(f);
            }
            fileMultiData = files;
            document.getElementById('uploadLabel').innerHTML = '파일 재선택';
        });
    } else {
        alert("Your browser doesn't support to File API")
    }
});

//추가 이미지 있을 경우
$("#btnMultiUpload").unbind("click").bind("click", function () {

    if(isRun === true) {
        return;
    } //중복실행방지

    isRun = true;

    console.log(fileData);
    console.log(fileMultiData);

    const form =  fileData;
    const data = new FormData();
    data.append('file', form);

    var photoIdarr = new Array();

    var shop_id = document.getElementById("currentShopID").value;

    var toy_url = "/api/toy?shop_id="+shop_id;
    var upload_url = "/api/photo/upload_image/";

    var toyId;

    //썸네일 이미지 업로드(포인트o)
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/api/photo/upload_image/thumbnail",
        data: data,
        async    : false,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 0,
        "headers": {
            "Authorization": localStorage.getItem("token")
        },
        success: function (data) {
            photoIdarr.push(data.photo_id);
            localStorage.setItem("photoIdarr", photoIdarr); //포토 id 로컬 스토리지에 저장
        },
        error: function (e) {
            alert("fail");
        }
    });

    //추가 이미지 업로드(포인트x)
    for (var i = 0; i < fileMultiData.length; i++) {
        const form =  fileMultiData[i];
        const data = new FormData();
        data.append('file', form);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/api/photo/upload_image",
            data: data,
            async    : false,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 0,
            success: function (data) {
                photoIdarr.push(data.photo_id);
                localStorage.setItem("photoIdarr", JSON.stringify(photoIdarr)); //포토 id 로컬 스토리지에 저장
            },
            error: function (e) {
                alert("fail");
            }
        });
    }

    //이미지 분석 및 페이지 연결
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "http://3.37.121.205:8000/finder/api/image_file",
        data: data,
        async    : false,
        dataType : "JSON",
        processData: false,
        contentType: false,
        cache: false,
        timeout: 0,
        success: function (data) {
            localStorage.setItem("data", JSON.stringify(data)); //분석결과 로컬 스토리지에 저장
            location.href="/analysis";
        },
        error: function (e) {
            alert("fail");
        }
    });
});