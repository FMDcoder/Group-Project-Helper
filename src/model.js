import initSqlJs from 'sql.js';

const DATABASE = [
    "PRAGMA foreign_keys = ON;",
    `CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
    );`,
    `CREATE TABLE project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
    );`,
    `CREATE TABLE projectUser (
    userId INTEGER NOT NULL,
    projectId INTEGER NOT NULL,
    isMember INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (userId, projectId),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    message TEXT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    time DATETIME NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE userMeeting (
    userId INTEGER NOT NULL,
    meetingId INTEGER NOT NULL,
    PRIMARY KEY (userId, meetingid),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (meetingid) REFERENCES meetings(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    value INTEGER NOT NULL
    );`,
    `CREATE TABLE task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    deadline DATETIME,
    projectId INTEGER NOT NULL,
    status INTEGER NOT NULL,
    assignedTo INTEGER,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (status) REFERENCES status(id),
    FOREIGN KEY (assignedTo) REFERENCES user(id)
    );`,
    `CREATE TABLE taskUser (
    userId INTEGER NOT NULL,
    taskId INTEGER NOT NULL,
    PRIMARY KEY (userId, taskId),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (taskId) REFERENCES task(id) ON DELETE CASCADE
    );`,
]

function sqlToJs(sq) {
    let l = [];
    let cols = sq[0].columns;
    function zipToObj(row) {
        let obj = {};
        cols.forEach((e, i) => { obj[e] = row[i]} );
        return obj;
    }
    sq[0].values.forEach(row => l.push(zipToObj(row)));
    return l;
}

const MOCK_DATA = {
    'user': [
        ['Joel', ''],
        ['Sawan', ''],
        ['Vanessa', ''],
        ['Mohamad', ''],
    ],
    'project': [
        ['HCI project', 'for the course DT137G',],
        ['Exam concert', 'rock and blues'],
        ['Final project ML', 'for Machine learning course'],
        ['Presentation', 'in other course']
    ],
    'task': [
        //name TEXT NOT NULL,
        //description TEXT,
        //deadline DATETIME, - YYYY-MM-DD HH:MI:SS
        //projectId INTEGER NOT NULL,
        //status INTEGER NOT NULL,
        //assignedTo INTEGER
        ['Start view', '...', '2026-01-10 22:00:00', 1, 2, 1],
        ['Project view', '...', '2026-01-11 23:59:59', 1, 1, 1],
        ['Task board view', '...', '2026-01-10 23:59:59', 1, 1, 1],
        ['Learn songs', 'Learn the keyboard parts of the songs', '2026-03-15 10:00:00', 2, 1, 1],
    ],
    'status': [
        ['To do', 0],
        ['In progress', 1],
        ['Done', 5]
    ]
}

class GroupProjectHelperModel {
    constructor(listener) {
        this.currentProject = { name: 'placeholder project' };
        this.observers = [listener];
        this.currentUser = { name: 'placeholder user', id: 1};
        this.dbReady = false;
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

      // Create a table
      DATABASE.forEach(s => this.db.run(s));
    }

    testDatabase() {
        MOCK_DATA.user.forEach(
            u => this.db.run(`INSERT INTO user (name, password) VALUES ("${u[0]}", "${u[1]}");`)
        );
        
        this.currentUser = sqlToJs(this.db.exec(`SELECT * FROM user WHERE name="${MOCK_DATA.user[0][0]}"`))[0];
    
        MOCK_DATA.project.forEach(
            p => this.db.run(`INSERT INTO project (name, description) VALUES ("${p[0]}", "${p[1]}");`)
        );
        
        MOCK_DATA.status.forEach(
            s => this.db.run(`INSERT INTO status (name, value) VALUES ("${s[0]}", ${s[1]})`)
        );
        
        let currentProject = this.db.exec(`SELECT * FROM project WHERE name = "${MOCK_DATA.project[0][0]}"`);
        this.currentProject = sqlToJs(currentProject)[0];
        
        this.getProjects().forEach(row => console.log(row.id));

        MOCK_DATA.task.forEach(
            t => this.db.run(
                `INSERT INTO task (name, description, deadline, projectId, status, assignedTo)\
                 VALUES ("${t[0]}", "${t[1]}", "${t[2]}", ${t[3]}, ${t[4]}, ${t[5]});`
            )
        );
        
        this.dbReady = true;
        
        //this.notifyObservers();
    }

    // getters
    getStatusID(name) {
        return this.db.exec(`SELECT id FROM status WHERE name="${name}"`);
    }

    getProjects() {
        return sqlToJs(this.db.exec(`SELECT * FROM project`));
    }
    
    getUserProjects() {
        return sqlToJs(this.db.exec(`SELECT * FROM project WHERE userId=${this.currentUser.id}`));
    }
    
    getCurrentProject() {
        return this.getProject(this.currentProject);
    }
    
    getProject(projectID) {
        //return this.projects.find(p => p.id == projectID);
        if (this.currentProject.length >= 0) { return {} }
        return this.currentProject;
    }
    
    getProjectTasks(projectID) {
        console.log( this.db.exec(`SELECT * FROM task WHERE projectId=${this.currentProject.id}`));
    }
    
    getUserTasks() {
        return ["do something", "and more"] //this.projects
            //.map(p => p.task.
            //    map(t => ({ ...t, project: p.id }))
            //).flat()
            //.filter(t => t.assignedTo === this.userID);
    }
    
    getTasksByDeadline() {
        return sqlToJs(this.db.exec(
            `SELECT task.id, task.name, deadline, project.name AS projectName FROM task, project
            WHERE task.projectId = project.id
            AND assignedTo=${this.currentUser.id}
            ORDER BY deadline`)
        );
    }

    getProjectTasksByDeadline(projectName) {
        return sqlToJs(this.db.exec(
            `SELECT task.id, task.name, deadline, project.name AS projectName FROM task, project
            WHERE task.projectId = project.id
            AND assignedTo=${this.currentUser.id}
            AND project=${this.currentProject.id}
            ORDER BY deadline`));
    }
    
    // setters
    setCurrentProject(id) {
        this.currentProjectID = id;
    }
}
export default GroupProjectHelperModel