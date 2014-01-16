var defaultServerUrl = 'http://localhost:8081/';


function getServerAddress() {
  var $serverUrl = $('#serverUrl');
  var url = $serverUrl.val();

  // Revert to default if the user has blanked the input field
  if (/^\s*$/.test(url)) {
    url = defaultServerUrl;
  }

  // Add a trailing slash if the supplied value doesn't already have one
  if (!/\/$/.test(url)) {
    url += '/';
  }

  $serverUrl.val(url);
  return url;
}

function getIngestiblesAddress() {
  return getServerAddress() + 'ingestibles';
}

function ingest(name, force) {
  $.ajax(getIngestiblesAddress(), {
    type: 'POST',
    data_type: 'jsonp',
    data: {
      name: name,
      force_reingest: force
    },
    success: function (data, textStatus, jqXHR) {
      alert('success'); // TODO
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(jqXHR.responseText);
    }
  });
}

function makeIngestAction($row, force) {
  return function (eventObject) {
    ingest($row.find('.archiveName').text(), force);
  }
}

function fillTable(ingestibleNames) {
  $(ingestibleNames).each(function (index, element) {
    var $row = $('tr.ingestible.prototype').clone().removeClass('prototype');

    $row.find('.archiveName').text(element);
    $row.find('.ingestButton button').click(makeIngestAction($row, false));
    $row.find('.forceButton button').click(makeIngestAction($row, true));

    $('#ingestibles tr:last').after($row);
    $row.show();
  });
}

function populate() {
  jQuery.ajax(getIngestiblesAddress(), {
    dataType: 'jsonp',
    success: function (data, textStatus, jqXHR) {
      alert(jqXHR.responseText);
      fillTable(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('Error: ' + textStatus);
    }
  });
}

populate();

