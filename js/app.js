const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 
var articulosCarrito;


cargarEventListeners();
function cargarEventListeners(){

    //cuando carge o recarge la pagina volvemos a llamar a carritoHTML() para que no se pierdan los agregados en localstorage
    document.addEventListener('DOMContentLoaded', () => {
        //si esta vacio solo agrega un array vacio
       articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    })

    //cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener('click',agregarCurso);

    //elimina cursos del carrito
    carrito.addEventListener('click',eliminarCurso);
      
    // Vaciar el carrito, usa una funcion anonima
    vaciarCarritoBtn.addEventListener('click', () =>{
        articulosCarrito=[];
        sincronizarStorage(); 
        vaciarCarrito();
    });
};

//funciones
function agregarCurso(e){
    e.preventDefault();
    //solo se ejecuta si el elemento que presionamos contiene agregar-carrito
    if( e.target.classList.contains('agregar-carrito')){ 
        //e.target imprime el elemento al que le hacemos click <a href...>
        //parent element es elemento padre o div
        const cursoSeleccionado= e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
    
};

//elimina curso del carrito
function eliminarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains('borrar-curso') ) {
         // e.target.parentElement.parentElement.remove();
         const cursoId = e.target.getAttribute('data-id')
         
         // Eliminar del arreglo del carrito
         articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId); //traer todos los elementos menos el que tenga ese id
        
         sincronizarStorage(); //actualizo localStorage
         carritoHTML();
          
    }
}


//lee el contenido del html al que le dimos click y extrae la informacion del curso

function leerDatosCurso(curso){
    console.log(curso);

//creamos el objeto
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent, //extrae el texto
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //reviso si un elemento yaexiste en un carrito
    const existe= articulosCarrito.some( curso => curso.id === infoCurso.id);
    if(existe){ //Actualizamos la cantidad            
        const cursos= articulosCarrito.map( curso => {            
            
            if( curso.id === infoCurso.id ){ //si el curso que contiene el carrito es igual al curso que estamos tratando de agregar 
                curso.cantidad++ ;
                var nuevoPrecio= parseInt(curso.precio, 10)*curso.cantidad;
                curso.precio= nuevoPrecio;
                return curso; //retorna el objeto actualizado
            }else{
                return curso;  //retorna los objetos que no son duplicados
            }
        } );
        articulosCarrito=[...cursos];
    }else{
        //agregamos el curso al carrito
        articulosCarrito= [...articulosCarrito,infoCurso];
    }
    sincronizarStorage(); 
    carritoHTML();
    

};

//Muestra el carrito de compras en el HTML
function carritoHTML() {
    //limpiar html
    vaciarCarrito();
    
    //recorre el carrito y genera el html
    JSON.parse(localStorage.getItem('carrito')).forEach( curso => {
         const { imagen, titulo, precio, cantidad, id }= curso;
         const row = document.createElement('tr');
         row.innerHTML = `
              <td>  
                   <img src="${imagen}" width=100>
              </td>
              <td>${titulo}</td>
              <td>$${precio}</td>
              <td>${cantidad} </td>
              <td>
                   <a href="#" class="borrar-curso" data-id="${id}">X</a>
              </td>
         `;
        
         //lo agregamos aca xq cuando agrega o elimina productos siempre llama a esta funcion
         //agrega el html del carrito en el tbody
         contenedorCarrito.appendChild(row);
        // sincronizarStorage(); 
    });
         
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito)); //sobreescribe
}

//elimina los cursos del tbody
function vaciarCarrito() {
    // forma lenta
    // contenedorCarrito.innerHTML = '';

    // forma rapida (recomendada)
    while(contenedorCarrito.firstChild) {
         contenedorCarrito.removeChild(contenedorCarrito.firstChild);
     }

}