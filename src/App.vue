<template>
  <nav>
    <router-link to="/">Startsidan</router-link> |
    <router-link to="/project">Projekt</router-link> |
    <router-link to="/taskboard">Taskboard</router-link>
    <pre>{{ results }}</pre>
  </nav>

  <router-view :model="model", :reRenderKey="reRenderKey" />
</template>

<script>
import GroupProjectHelperModel from './model.js'
import initSqlJs from 'sql.js';

  export default {
    data() {
      return {
        model: new GroupProjectHelperModel(this.reRender.bind(this)),
        reRenderKey: 0,
        results: []
      }
    },
    async mounted() {
    // Run database setup when page loads
    await this.setupDatabase();
    },
    methods: {
      reRender() {
        this.reRenderKey += 1;
      },

      async setupDatabase() {
      // Load SQL.js
      const SQL = await initSqlJs({
        // Optional: Path to wasm file if not bundled
        locateFile: file => document.location.origin+`/database.wasm`
      });

      // Create in-memory database
      const db = new SQL.Database();

      // Create a table
      db.run("CREATE TABLE users (id INTEGER, name TEXT);");

      // Insert some data
      db.run("INSERT INTO users VALUES (1, 'Alice');");
      db.run("INSERT INTO users VALUES (2, 'Bob');");

      // Query data
      const res = db.exec("SELECT * FROM users;");
      
      // The results are in res[0].values
      this.results = res[0].values;
    }
    }
  }
</script>