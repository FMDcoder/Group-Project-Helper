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
      this.db = new SQL.Database();
    }

    async testDatabase() {
      // Create a table
        this.db.run("PRAGMA foreign_keys = ON;");

        this.db.run(`
            CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            namn TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
            );
        `);

        this.db.run(`
            CREATE TABLE project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            beskrivning TEXT
            );
        `);

        this.db.run(`
            CREATE TABLE projectUser (
            userid INTEGER NOT NULL,
            projectid INTEGER NOT NULL,
            isMember INTEGER NOT NULL DEFAULT 1,
            PRIMARY KEY (userid, projectid),
            FOREIGN KEY (userid) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (projectid) REFERENCES project(id) ON DELETE CASCADE
            );
        `);

        this.db.run(`
            CREATE TABLE messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectid INTEGER NOT NULL,
            userid INTEGER NOT NULL,
            message TEXT NOT NULL,
            FOREIGN KEY (projectid) REFERENCES project(id) ON DELETE CASCADE,
            FOREIGN KEY (userid) REFERENCES user(id) ON DELETE CASCADE
            );
        `);

        this.db.run(`
            CREATE TABLE meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectid INTEGER NOT NULL,
            time DATETIME NOT NULL,
            FOREIGN KEY (projectid) REFERENCES project(id) ON DELETE CASCADE
            );
        `);

        this.db.run(`
            CREATE TABLE userMeeting (
            userid INTEGER NOT NULL,
            meetingid INTEGER NOT NULL,
            PRIMARY KEY (userid, meetingid),
            FOREIGN KEY (userid) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (meetingid) REFERENCES meetings(id) ON DELETE CASCADE
            );
        `);

        this.db.run(`
            CREATE TABLE status (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            value INTEGER NOT NULL
            );
        `);

        this.db.run(`
            CREATE TABLE tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            beskriving TEXT,
            deadline DATETIME,
            projectid INTEGER NOT NULL,
            status INTEGER NOT NULL,
            FOREIGN KEY (projectid) REFERENCES project(id) ON DELETE CASCADE,
            FOREIGN KEY (status) REFERENCES status(id)
            );
        `);

        this.db.run(`
            CREATE TABLE taskUser (
            userid INTEGER NOT NULL,
            taskid INTEGER NOT NULL,
            PRIMARY KEY (userid, taskid),
            FOREIGN KEY (userid) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (taskid) REFERENCES tasks(id) ON DELETE CASCADE
            );
        `);
      
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