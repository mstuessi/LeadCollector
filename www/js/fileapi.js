/* Written by: Yishai Gronich */
// File from https://github.com/poja/PhoneGap-FileAPI-Improved
var  failCB = function (msg) {
    return function () {
        alert('Failed: ' + msg);
    };
},
deviceReady=false;

document.addEventListener("deviceready", function(){
                          deviceReady=true;
                          }, false);


function saveText(text, filePath, doneCB) {
	var fail=failCB("Getting file system.");
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS_Save, fail);
	function gotFS_Save(fs) {
		var fail = failCB('Getting file');
		fs.root.getFile(filePath, {create: true, exclusive: false},
						gotFileEntry, fail);
	}
	function gotFileEntry(fileEntry) {
		var fail = failCB('Creating writer');
		fileEntry.createWriter(gotFileWriter, fail);
	}
	function gotFileWriter(fileWriter) {
		fileWriter.onwriteend = function (evt) {
			doneCB();
		};
		fileWriter.seek(0);
		fileWriter.write(text);
	}
	return false;
}

function appendText(text, filePath, doneCB) {
    var fail=failCB("Getting file system.");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS_Save, fail);
    
    function gotFS_Save(fs) {
        var fail = failCB('Getting file');
        fs.root.getFile(filePath, {create: true, exclusive: false}, gotFileEntry, fail);
    }
    
    function gotFileEntry(fileEntry) {
		var fail = failCB('Creating writer');
		fileEntry.createWriter(gotFileWriter, fail);
	}
    
    function gotFileWriter(fileWriter) {
		fileWriter.onwriteend = function (evt) {
			doneCB();
		};
		fileWriter.seek(fileWriter.length);
		fileWriter.write(text);
	}
}

function readText(filePath, finishCB) {
	var fileEntry,
    fail= failCB("Requesting file system.");
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS_Read, fail);
	function gotFS_Read(fs) {
		var fail = failCB('Getting File');
		fs.root.getFile(filePath, {create: true, exclusive: false},
						gotFileEntry, fail);
	}
	function gotFileEntry(FE) {
		fileEntry=FE;
		fileEntry.file(function (file) {
                       var reader = new FileReader();
                       reader.onloadend = function (evt) { /*asyncronous event*/
                       finishCB(evt.target.result);
                       };
                       reader.readAsText(file);
                       }, failCB("Reading file"));
	}
}