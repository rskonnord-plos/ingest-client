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

function getIngestiblesQueryAddress() {
  return getServerAddress() + 'ingestibles';
}

function getPublishableQueryAddress() {
  return getServerAddress() + 'articles?state=ingested';
}

function makeIngestAction(name, force) {
  return function (eventObject) {
    $.ajax(getIngestiblesQueryAddress(), {
      type: 'POST',
      data_type: 'jsonp',
      data: {
        name: name,
        force_reingest: force
      },
      success: function (data, textStatus, jqXHR) {
        refresh();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(textStatus);
      }
    });
  }
}

function fillIngestibleTable(ingestibleNames) {
  $(ingestibleNames).each(function (index, element) {
    var $row = $('tr.ingestible.prototype').clone().removeClass('prototype');

    $row.find('.archiveName').text(element);
    $row.find('.ingestButton button').click(makeIngestAction(element, false));
    $row.find('.forceButton button').click(makeIngestAction(element, true));

    $('#ingestibles tr:last').after($row);
    $row.show();
  });
}

function makePublishAction(name) {
  return function (eventObject) {
    var url = getServerAddress() + 'articles/' + name
    $.ajax(url, {
      type: 'PATCH',
      contentType: 'application/json',
      data: {
        state: 'published'
      },
      success: function (data, textStatus, jqXHR) {
        refresh();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(textStatus);
      }
    });
  }
}

function fillPublishableTable(articleIds) {
  $(articleIds).each(function (index, element) {
    var $row = $('tr.publishable.prototype').clone().removeClass('prototype');

    $row.find('.articleId').text(element);
    $row.find('.publishButton button').click(makePublishAction(element));

    $('#publishables tr:last').after($row);
    $row.show();
  });
}

function refresh() {
  $('.ajax-entity:not(.prototype)').remove();
  jQuery.ajax(getIngestiblesQueryAddress(), {
    dataType: 'jsonp',
    success: function (data, textStatus, jqXHR) {
      fillIngestibleTable(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('Error: ' + textStatus);
    }
  });
  jQuery.ajax(getPublishableQueryAddress(), {
    dataType: 'jsonp',
    success: function (data, textStatus, jqXHR) {
      fillPublishableTable(Object.keys(data));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('Error: ' + textStatus);
    }
  });
}

refresh();

