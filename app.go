package main

import (
	"context"
	"encoding/json"
	"os"
	"sort"

	"github.com/google/uuid"
)

// App struct
type App struct {
	ctx context.Context
}

type Task struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Status int    `json:"status"`
}

var FILE_NAME = "tasks.json"

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) LoadFile() (string, error) {
	loadedTasks, err := LoadTasksFromFile()
	if err != nil {
		return "", err
	}

	data, err := json.Marshal(loadedTasks)

	if err != nil {
		return "", err
	}

	return string(data), nil

}

func LoadTasksFromFile() ([]Task, error) {
	// Open the JSON file
	file, err := os.Open(FILE_NAME)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Decode JSON directly to slice of users
	var tasks []Task
	if err := json.NewDecoder(file).Decode(&tasks); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (a *App) UpdateTaskStatus(taskid string) error {
	loadedTasks, err := LoadTasksFromFile()
	if err != nil {
		return err
	}
	for i, task := range loadedTasks {
		if task.ID == taskid {
			if loadedTasks[i].Status == 1 {
				loadedTasks[i].Status = 0
			} else {
				loadedTasks[i].Status = 1
			}
		}
	}
	err = writeToFile(loadedTasks)
	if err != nil {
		return err
	}
	return nil
}

func (a *App) DeleteTask(taskid string) error {
	loadedTasks, err := LoadTasksFromFile()
	if err != nil {
		return err
	}
	for i, task := range loadedTasks {
		if task.ID == taskid {
			loadedTasks = append(loadedTasks[:i], loadedTasks[i+1:]...)
		}
	}
	err = writeToFile(loadedTasks)
	if err != nil {
		return err
	}
	return nil
}

func (a *App) AppendTasksToFile(title string) error {

	tasksToAdd := []Task{
		{ID: uuid.New().String(), Title: title, Status: 0},
	}

	// Load existing users
	loadedTasks, err := LoadTasksFromFile()
	if err != nil {
		return err
	}

	// Append new users
	loadedTasks = append(tasksToAdd, loadedTasks...)

	err = writeToFile(loadedTasks)
	if err != nil {
		return err
	}
	return nil
}

func (a *App) SortTasks() error {
	loadedTasks, err := LoadTasksFromFile()
	if err != nil {
		return err
	}
	sort.SliceStable(loadedTasks, func(i, j int) bool {
		return loadedTasks[i].Status < loadedTasks[j].Status
	})

	err = writeToFile(loadedTasks)
	if err != nil {
		return err
	}
	return nil

}

func (a *App) ClearTaskList() error {
	err := writeToFile(nil)
	if err != nil {
		return err
	}
	return nil
}

func writeToFile(tasks []Task) error {

	// Open the file for writing
	file, err := os.Create(FILE_NAME)
	if err != nil {
		return err
	}
	defer file.Close()

	// Encode the combined users and write it to the file
	encoder := json.NewEncoder(file)
	if err := encoder.Encode(tasks); err != nil {
		return err
	}
	return nil
}
