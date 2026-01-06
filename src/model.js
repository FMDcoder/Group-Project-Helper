import initSqlJs from 'sql.js';

const MOCK_PROJECTS = [
    {
        "id": 0,
        "name": "HCI project",
        "progress": 0.9,
        "tasks": [
            {
                "title": "Create start view",
                "deadline": ("2026-01-08 11:00"),
                "assignedTo": "Joel",
            },
            {
                "title": "Create project view",
                "deadline": ("2026-01-09"),
                "assignedTo": "Joel",
            },
            {
                "title": "Create taskboard view",
                "deadline": ("2026-01-06"),
                "assignedTo": "Joel",
            },
            {
                "title": "Create menu",
                "deadline": ("2026-01-07"),
                "assignedTo": "Vanessa",
            },
        ]
    },
    {
        "id": 1,
        "name": "Book review presentation",
        "progress": 0.2,
        "tasks": [
            {
                "title": "Read book",
                "deadline": ("2026-01-17"),
                "assignedTo": "Joel",
            }
        ],
    },
    {
        "id": 2,
        "name": "Lego robot",
        "progress": 0.6,
        "tasks": [],
    },
]


class GroupProjectHelperModel {
    constructor(listener) {
        this.projects = MOCK_PROJECTS;
        this.observers = [listener];
        this.ready = true;
        this.userID = 'Joel';
    }
    
    // observer code
    addObserver(observer) {
        this.observers =[...this.observers, observer];
    }

    notifyObservers(payload) {
        function callObserverCallback(observer){
            try{
                observer(payload);
            }
            catch(err){
                console.error(err);
            }
        }

        this.observers.forEach(callObserverCallback);
    }
    
    // SQL database
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
      return res[0].values;
    }

    // getters
    getProjects() {
        return this.projects;
    }
    
    getCurrentProject() {
        return this.getProject(this.currentProjectID);
    }
    
    getProject(projectID) {
        return this.projects.find(p => p.id == projectID);
    }
    
    getProjectTasks(projectID) {
        return this.projects.find(p => p.id == projectID).tasks;
    }
    
    getUserTasks() {
        return this.projects
            .map(p => p.tasks.
                map(t => ({ ...t, project: p.id }))
            ).flat()
            .filter(t => t.assignedTo === this.userID);
    }
    
    getTasksByDeadline() {
        return this.getUserTasks()
            .sort((a, b) => a.deadline - b.deadline);
    }

    getProjectTasksByDeadline(projectName) {
        return this.getProjectTasks(projectName)
            .filter(t => t.assignedTo === this.userID)
            .sort((a, b) => a.deadline - b.deadline);
    }
    
    isReady() {
        return this.ready;
    }
    
    // setters
    setUserID(userID) {
        this.userID = userID;
    }
    
    setCurrentProject(id) {
        this.currentProjectID = id;
    }
    
    testDbModel() {
        testDB();
    }
}
export default GroupProjectHelperModel