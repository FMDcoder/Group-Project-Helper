<template>
    <div>
        <button @click="openProject">Edit Projekt</button>
    </div>
    <div v-if="viewEditEroject" @click.self="closeProject" class="popup">
        <div class="container">
            <form @submit="submit">
                <h2>Redigera Projektet</h2>
                <div>
                    <label>Namn</label>
                    <input type="text" :v-model="projectName">
                </div>
                <div>
                    <label>Beskrivning</label><br>
                    <textarea :v-model="projectBe">
                    </textarea>
                </div>
                <div>
                    <input type="submit" value="submit">
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["model"],
        data() {
            return {
                viewEditEroject: false,
                projectName: "",
                projectDescription: ""
            }
        }, 
        methods: {
            closeProject() {
                this.viewEditEroject = false;
            },
            openProject() {
                this.viewEditEroject = true;
            },
            submit() {

            }
        }
    }
</script>

<style scoped>
    .popup {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
    }

    .container {
        width: 50%;
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        border: 1px solid gray;
    }

    form {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    form div {
        width:80%;

        display: flex;
        justify-content: center;
        flex-direction: column;
        flex-wrap: wrap;
        align-content: center;

        padding-bottom: 10px;
        padding-top: 10px;
    }

    form > div > label {
        padding-right:10px;
    }

    form > div > input {
        width: 300px;
    }

    textarea {
        width: 300px;
        height: 100px;
    }
</style>