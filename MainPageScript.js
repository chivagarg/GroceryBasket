var isResolved = false;
var currentServingSizeUnit;
var queryHash = {};
function QueryItemFromNutritionX()
{
  var query = document.getElementById('id_itemName').value;
  var paramString='{"appId":"9ca93004", "appKey": "769a7bfd0563bf4e30441f56c4c833e2", "limit":"10", "fields":["item_id", "item_name", "brand_name", "nf_serving_size_unit", "nf_serving_size_qty", "nf_servings_per_container"], "query":"' + query + '"}';
  var url = "https://api.nutritionix.com/v1_1/search";
  CreateAndSendRequest("POST",paramString,url,function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      var list = document.getElementById('id_ulist');
      var hitsArray = JSON.parse(xmlhttp.responseText).hits;


      for (var i = 0; i < hitsArray.length; i++)
      {
        var listItem = document.createElement('li');
        var itemNameResponse = hitsArray[i].fields.item_name;
        var brandNameResponse = hitsArray[i].fields.brand_name;
        var servingSizeQtyResponse = hitsArray[i].fields.nf_serving_size_qty;
        var servingSizeUnitResponse = hitsArray[i].fields.nf_serving_size_unit;
        var servingsPerContainerResponse = hitsArray[i].fields.nf_servings_per_container;
        var itemIdResponse = hitsArray[i].fields.item_id;

        var textToDisplay = itemNameResponse + " | " + brandNameResponse;
        listItem.appendChild(document.createTextNode(textToDisplay));
        list.appendChild(listItem);

        var responseArrayList = [
              { item_id : itemIdResponse, item_name: itemNameResponse, brand_name: brandNameResponse, nf_serving_size_unit: servingSizeUnitResponse, nf_serving_size_qty: servingSizeQtyResponse, nf_servings_per_container: servingsPerContainerResponse}
        ];
        queryHash[i] = responseArrayList;
        //alert(queryHash[0][0].nf_serving_size_unit);
      }

      $("#id_LoadResponseTxt").hide();
      AddClickEventToListItems();
    }
  });
}

function AddClickEventToListItems()
{
  var lis = document.getElementById("id_ulist").getElementsByTagName('li');

  for (var i=0; i<lis.length; i++) {
    lis[i].addEventListener('click', OnListItemClicked, false);
  }

  function OnListItemClicked() {
    if (!isResolved)
    {
      var listIndexSelected = $(this).index();
      document.getElementById('id_itemName').value = this.innerHTML;
      $("#id_quantity").slideDown("fast");
      var selectedItemUnit = queryHash[listIndexSelected][0].nf_serving_size_unit;
      var servingSizeQuantity = parseFloat(queryHash[listIndexSelected][0].nf_serving_size_qty);
      var servingsPerContainer = parseFloat(queryHash[listIndexSelected][0].nf_servings_per_container);
      document.getElementById("id_unit").innerHTML = selectedItemUnit;
      document.getElementById("id_qnty").value = servingSizeQuantity * servingsPerContainer;

      document.getElementById("id_suggestionspanel").style.visibility='hidden';
    }
  }
}

function CreateRequestObject()
{
  if (window.XMLHttpRequest)
  {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }  
}

function CreateAndSendRequest(requestType,paramString,url,cfunc)
{
  CreateRequestObject();

  xmlhttp.onreadystatechange=cfunc;

  xmlhttp.open(requestType,url,true);
  
  if (requestType === "POST")
    xmlhttp.setRequestHeader("Content-type","application/json");
  
  xmlhttp.send(paramString);
}

function ItemNameResolver()
{
  var query = document.getElementById('id_itemName').value;
  var paramString='{"appId":"9ca93004", "appKey": "769a7bfd0563bf4e30441f56c4c833e2", "limit":"10", "fields":["item_name", "brand_name", "nf_serving_size_unit"], "query":"' + query + '"}';
  var url = "https://api.nutritionix.com/v1_1/search";
  CreateAndSendRequest("POST",paramString,url,function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      document.getElementById("id_suggestionspanel").innerHTML = hitsArray.length;
    }
  });
}
