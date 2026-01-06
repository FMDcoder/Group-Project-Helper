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

    // getters
    getProjects() {
        return this.projects;
    }
    
    getProject(projectID) {
        return this.projects.filter(p => p.id === projectID);
    }
    
    getProjectTasks(projectID) {
        return this.projects.find(p => p.id === projectID).tasks;
    }
    
    getUserTasks() {
        return this.projects.map(p => p.tasks).flat()
            .filter(t => t.assignedTo === this.userID);
    }
    
    getTasksByDeadline() {
        return this.getUserTasks(this.userID)
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
}
export default GroupProjectHelperModel