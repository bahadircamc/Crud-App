// baglanti kontrolu
// console.log(`selam JS`);
let editMode = false; // duzenleme modunu belirleycej degisken.
let editItem; // duzenleme elemanini belirleycek degisken.
let editItemId; // duzenleme elemaninin id'si.
// ! html' den elemanlari cagirma
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

// !!!!!!! fonksiyonlar 

// * form gonderildiginde calisacak fonksiyon
const addItem = (e) => {
    // sayfanin yenilenmesini iptal et
    e.preventDefault();
    const value = input.value;
    if (value !== "" && !editMode) {
        // silme islemleri icin benzersiz bir deger olustur.
        const id = new Date().getTime().toString();
        createElement(id, value);
        setToDefault();
        showAlert("Eleman Eklendi", "success");
        addToLocalStorage(id,value);
    }
    else if (value !== "" && editMode) {
        editItem.innerHTML = value;
        updateLocalStorage(editItemId, value);
        showAlert("Eleman Guncellendi", "success");
        setToDefault();
    }
    else {
        showAlert("Lutfen eleman giriniz", "danger");
    }
    clearButton.style.display = "block";
};
//  * uyari veren fonksiyon
const showAlert = (text, action) => {
    // alert metin ekle.
    alert.textContent = `${text}`;
    // alert class ekle.
    alert.classList.add(`alert-${action}`);
    // alerti 3 saniye sonra kaldır.
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
};
// * elemanlari silen fonksityon
const deleteItem = (e) => {
    // silmek istedigin elemani bul.
    const element = e.target.parentElement.parentElement.parentElement;
    const id = element.dataset.id;
    // eger silinecek eleman varsa sil.
    itemList.removeChild(element);
    removeFromLocalStorage(id);
    showAlert("Eleman Silindi", "danger");
    // egerki hic eleman yoksa clear list butonunu  kaldir.
    if (!itemList.children.length) {
        clearButton.style.display = "none";
    };

};
//* elemanlari guncelleyecek fonksiyon.
const editItems = (e) => {
    const element = e.target.parentElement.parentElement.parentElement;
    editItem = e.target.parentElement.parentElement.previousElementSibling;
    input.value = editItem.innerText;
    editMode = true;
    editItemId = element.dataset.id;
    addButton.textContent = "Duzenle";
};
//* varsayilan degerlere donduren fonksiyon.
const setToDefault = () => {
    input.value = "";
    editMode = false;
    editItemId = "";
    addButton.textContent = "Ekle";
};
//* Sayfa yuklendiginde elemanlari render eden fonnks.
const renderItems = () => {
    let items = getFromLocalStorage();
    if(items.length > 0) {
        items.forEach((item)=>createElement(item.id,item.value));
    };


};
// *Eleman olusturan fonksiyon 
const createElement = (id, value) => {
    const newDiv = document.createElement("div");
    //bu div e attribute ekle
    newDiv.setAttribute("data-id", id); //!setAttribute ile bir elemana bu sekilde attribute ekleyebiliriz.

    //bu div e class ekle
    newDiv.classList.add("items-list-item");
    //bu div in Html icergini belirle
    newDiv.innerHTML = `
        <p class="item-name">${value}</p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
    `;
    // Delete ve edit butonuna eris.
    const deleteBtn = newDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', deleteItem);

    const editBtn = newDiv.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItems);

    itemList.appendChild(newDiv);
    showAlert("Eleman Eklendi", "success");
};
//* sifirlama yapan fonksiyon.
const clearItems = () => {
    const items = document.querySelectorAll('.items-list-item');
    if (items.length>0){
        items.forEach((item)=>{
            itemList.removeChild(item);
        });
        clearButton.style.display = "none";
        showAlert("Tüm Elemanlar Silindi", "danger");
        // localstorage i da temizledik.
        localStorage.removeItem("items");
    }
};
// * Localstorage'a kayıt yapan fonksiyon
const addToLocalStorage = (id, value) => {
    const item = { id, value };
    let items = getFromLocalStorage(); // items dizisini al
    items.push(item); // yeni öğeyi dizinin sonuna ekle
    localStorage.setItem('items', JSON.stringify(items)); // localStorage'a güncel diziyi kaydet
};
// * Localstorage'den verileri alan fonksiyon
const getFromLocalStorage = () => {
    // localStorage'de "items" anahtarı varsa, JSON'u parse et ve döndür; yoksa boş bir dizi döndür
    return localStorage.getItem("items")
     ? JSON.parse(localStorage.getItem("items")) : [];
};
//* LOCALSTORGE DAn VERILERI kaldiran fonksioyn.
const removeFromLocalStorage = (id) => {
    let items = getFromLocalStorage(); // items dizisini al
    items = items.filter((item) => item.id !== id); // yeni öğeyi dizinin sonuna ekle
    localStorage.setItem('items', JSON.stringify(items)); // localStorage'a güncel diziyi kaydet
};
//* Localstorage guncelleyen fonksion.
const updateLocalStorage = (id,newValue) =>{
    let items = getFromLocalStorage();
    items = items.map((item) => { // items listesindeki ogeleri map fonks. ile dolasti.
        if(item.id === id){
            // burada value kismini guncelledik bunun disinda kalan items ozelliklerini ise sabit tuttuk.
            return {...item, value: newValue}; //return {...item, value: newValue}; ifadesi, item nesnesinin tüm özelliklerini kopyalayıp value özelliğini newValue ile günceller. Bu teknik, "spread operator" olarak adlandırılır.
        }
        return item;
    });
    localStorage.setItem('items', JSON.stringify(items));
}

// ? Olay izleyicileri 
//*Formun gonderildigi ani yakala
form.addEventListener('submit', addItem);
//*sayfa yuklenildigi ani yakala
window.addEventListener("DOMContentLoaded", renderItems);
//* clear butonuna tiklanildiginda elemanlari sifirla.
clearButton.addEventListener("click",clearItems);

