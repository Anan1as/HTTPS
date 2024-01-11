let nombre = document.getElementById("nombre");
let correo = document.getElementById("correo");
let tabla = document.getElementById("table");
let modal = new bootstrap.Modal(document.querySelector('#myModal'));
let modalBody = document.querySelector('.modal-body');

let response = fetch('https://memin.io/public/api/users')
.then(response => {
    return response.json();
}).then(data => {
    data.forEach(function (element) {
        let fila = document.createElement("tr");

        let IdCell = document.createElement("td");
        IdCell.classList.add('px-2')
        IdCell.textContent = element.id;
        
        let nameCell = document.createElement("td");
        nameCell.textContent = element.name;
        
        let emailCell = document.createElement("td");
        emailCell.textContent = element.email;

        let optionCell = document.createElement("td");

        let infoBtn = document.createElement("button");
        infoBtn.textContent = "Info";
        infoBtn.classList.add('btn', 'btn-info');
        infoBtn.setAttribute("data-toggle", "modal");
        infoBtn.setAttribute("data-target", "#myModal");
        infoBtn.addEventListener("click", function () {
            modalBody.innerHTML = `
            <h5>ID: ${element.id}</h5>
            <p>Nombre: ${element.name}</p>
            <p>Email: ${element.email}</p>
            <p>Password: ${element.password}</p>
            <p>Last update: ${element.updated_at}</p>
            <p>Created at: ${element.created_at}</p>`

            modal.show();
        });

        // Botón Editar
        let editarBtn = document.createElement("button");
        editarBtn.textContent = "Editar";
        editarBtn.classList.add('btn', 'btn-warning');
        editarBtn.addEventListener("click", function () {
            nombre.value = nameCell.textContent;
            correo.value = emailCell.textContent;
            localStorage.setItem('id', element.id);
        });

        // Botón Eliminar
        let eliminarBtn = document.createElement("button");
        eliminarBtn.textContent = "Eliminar";
        eliminarBtn.classList.add('btn', 'btn-danger');
        eliminarBtn.addEventListener("click", function () {
            fetch(`https://memin.io/public/api/users/${element.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log('Usuario eliminado:', data);
        
                // Eliminar la fila de la tabla
                let rowEliminada = optionCell.parentElement;
                rowEliminada.parentElement.removeChild(rowEliminada);
            })
        });

        optionCell.append(infoBtn, editarBtn, eliminarBtn);
        fila.append(IdCell, nameCell, emailCell, optionCell);

        tabla.appendChild(fila);
    });
});

//Boton de enviar
let enviar = document.getElementById("enviar");

enviar.addEventListener("click", function() {
    let id = localStorage.getItem("id");
    let newName = nombre.value;
    let newEmail = correo.value;

    // Si hay un ID válido, actualiza la información
    if (id) {
        fetch(`https://memin.io/public/api/users/${id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName, email: newEmail }),
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('Usuario actualizado:', data);
            localStorage.clear();

            nombre.value = '';
            correo.value = '';
        })
    } else {//En otro caso, hace un nuevo usuario
        fetch('https://memin.io/public/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName, email: newEmail }),
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('Usuario registrado como:', data);

            nombre.value = '';
            correo.value = '';
        });
    };
});

//Boton para recargar la página
let recargar = document.getElementById("recargar");

recargar.addEventListener("click", function() {
    location.reload();
});