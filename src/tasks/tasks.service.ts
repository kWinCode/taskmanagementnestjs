import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   // do something with status
  //   if (tasks) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   // do something with search
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    // find one matches the first entity that matches some id or find options
    const found = await this.tasksRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
  // deleteTaskById(id: string): void {
  //   // alternative approach (manipulates the existing tasks)
  //   // const index = this.tasks.map((task) => task.id).indexOf(id);
  //   // this.tasks.splice(index, 1);
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   // const index = this.tasks.map((task) => task.id).indexOf(id);
  //   // const task = this.tasks[index];
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
