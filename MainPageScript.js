var isResolved = false;
var currentServingSizeUnit;
var queryHash = {};
var groceryBasket = {};
var listIndexSelected;

function QueryItemFromNutritionX()
{
  if (!isResolved)
  {
    document.getElementById("id_suggestionspanel").style.visibility='visible';
    var query = document.getElementById('id_itemName').value;
    var paramString='{"appId":"9ca93004", "appKey": "769a7bfd0563bf4e30441f56c4c833e2", "limit":"10", "fields":["item_id", "item_name", "brand_name", "nf_serving_size_unit", "nf_serving_size_qty", "nf_servings_per_container","nf_total_fat", "nf_calories", "nf_total_carbohydrate", "nf_protein"], "query":"' + query + '"}';
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
          var calories = hitsArray[i].fields.nf_calories;
          var fat = hitsArray[i].fields.nf_total_fat;
          var carbs = hitsArray[i].fields.nf_total_carbohydrate;
          var protein = hitsArray[i].fields.nf_protein;
          var itemIdResponse = hitsArray[i].fields.item_id;

          var textToDisplay = itemNameResponse + " | " + brandNameResponse;
          listItem.appendChild(document.createTextNode(textToDisplay));
          list.appendChild(listItem);

          var responseArrayList = [
                { itemId : itemIdResponse, itemName: itemNameResponse, brandName: brandNameResponse, itemQuantity: 0, servingSizeUnit: servingSizeUnitResponse, servingSizeQty: servingSizeQtyResponse, servingsPerContainer: servingsPerContainerResponse, protein: protein, fat: fat, carbs: carbs, cals: calories}
          ];
          queryHash[i] = responseArrayList;
        }

        $("#id_LoadResponseTxt").hide();
        AddClickEventToListItems();
      }
    });
  }
  else
  {
    // Resolved
    var dataList = queryHash[listIndexSelected][0];
    dataList.itemQuantity = parseFloat(document.getElementById("id_qnty").value);

    var selectedItemId = dataList.itemId;
    groceryBasket[selectedItemId] = dataList;
    alert("Item Qty is " + groceryBasket[selectedItemId].itemQuantity);
    alert(groceryBasket[selectedItemId].fat + " is the fat value");
    alert(groceryBasket[selectedItemId].protein + " is the protein");
    alert(groceryBasket[selectedItemId].carbs + " is the carbs");
    alert(groceryBasket[selectedItemId].cals + " is the calories");

    alert(groceryBasket[selectedItemId].itemName + " added to your Grocery Basket!");
    document.getElementById("id_quantitySpan").style.display="none";
    document.getElementById("id_itemName").value = "";
    document.getElementById("id_itemName").focus();
    ToggleButtonText("id_addButton");
    isResolved = false;
    var list = document.getElementById('id_ulist');
    while ( list.firstChild ) list.removeChild( list.firstChild );
    $("#id_LoadResponseTxt").show();
    document.getElementById("id_suggestionspanel").style.visibility='hidden';
    alert("Current basket size = " + Object.keys(groceryBasket).length);
  }
}

function Checkout()
{
  tableCreate();
}

function AddClickEventToListItems()
{
  var lis = document.getElementById("id_ulist").getElementsByTagName('li');

  for (var i=0; i<lis.length; i++) {
    lis[i].addEventListener('click', OnListItemClicked, false);
  }

  function OnListItemClicked() {
    //if (!isResolved)
    //{
      isResolved = true;
      listIndexSelected = $(this).index();
      document.getElementById('id_itemName').value = this.innerHTML;
      $("#id_quantitySpan").slideDown("fast");
      var selectedItemUnit = queryHash[listIndexSelected][0].servingSizeUnit;
      var servingSizeQuantity = parseFloat(queryHash[listIndexSelected][0].servingSizeQty);
      var servingsPerContainer = parseFloat(queryHash[listIndexSelected][0].servingsPerContainer);
      alert("Unit " + queryHash[listIndexSelected][0].servingSizeUnit);
      alert("Serving Size Qty = " + queryHash[listIndexSelected][0].servingSizeQty);
      alert("Servings per container = " + queryHash[listIndexSelected][0].servingsPerContainer);
      document.getElementById("id_unit").innerHTML = selectedItemUnit;
      document.getElementById("id_qnty").value = servingSizeQuantity * servingsPerContainer;
      ToggleButtonText("id_addButton");
    //}
  }
}

function ToggleButtonText(button_id)  {
   var text = document.getElementById(button_id).firstChild;
   text.data = text.data == "Lookup" ? "Add" : "Lookup";
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


function tableCreate()
{
    document.getElementById("id_suggestionspanel").style.visibility='visible';
    document.getElementById("id_LoadResponseTxt").innerHTML = "Results"
    $("#id_suggestionspanel").slideDown("fast");

    var tbl  = document.getElementById('id_resultsTable');
    tbl.style.width='100%';

    // Create header row
    var tr = tbl.insertRow();
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Item Name"));
    td.style.width="300px";
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Qty"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Cals"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Carb"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Prot"));
    var td = tr.insertCell();
    td.appendChild(document.createTextNode("Fat"));

    for (var key in groceryBasket)
    {
      var innerHashMap = groceryBasket[key];
      var itemName = innerHashMap["itemName"];
      var itemQty = innerHashMap["itemQuantity"];
      var servingSize = innerHashMap["servingSizeQty"];
      var unit = innerHashMap["servingSizeUnit"];
      var calsPerServing = innerHashMap["cals"];
      var carbsPerServing = innerHashMap["carbs"];
      var fatPerServing = innerHashMap["fat"];
      var proteinPerServing = innerHashMap["protein"];


      var numOfServings = itemQty/servingSize;
      var totalCals = calsPerServing*numOfServings;
      var totalCarbs = carbsPerServing*numOfServings;
      var totalFat = fatPerServing*numOfServings;
      var totalProtein = proteinPerServing*numOfServings;

      // Feed data to the table
      var tr = tbl.insertRow();
      var td = tr.insertCell();
      td.appendChild(document.createTextNode(itemName));

      var td = tr.insertCell();
      td.appendChild(document.createTextNode(itemQty + " " + unit));
      var td = tr.insertCell();
      td.appendChild(document.createTextNode(totalCals));
      var td = tr.insertCell();
      td.appendChild(document.createTextNode(totalCarbs));
      var td = tr.insertCell();
      td.appendChild(document.createTextNode(totalProtein));
      var td = tr.insertCell();
      td.appendChild(document.createTextNode(totalFat));
    }
}
