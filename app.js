const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// create elements and render cafe list
function rendreCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().Name;
    city.textContent = doc.data().City;
    cross.textContent = "x";

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (evt) => {
        evt.stopPropagation();
        let id = evt.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })

}


// get data
// db.collection('cafes').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         rendreCafe(doc);
//     });
// });

// this is for quering data (commented out for now)
// .when('field value', 'peramiter [grater, less equal]', 'query value')
// db.collection('cafes').where('City', '==', 'New York').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         rendreCafe(doc);
//     });
// });

//this is for ordering data
//.orderBy('field value')
// db.collection('cafes').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         rendreCafe(doc);
//     });
// });

// save data

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    db.collection('cafes').add({
        Name: form.name.value,
        City: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});


// get data real time
db.collection('cafes').orderBy('City').onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
        if(change.type == 'added'){
            rendreCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    });
});