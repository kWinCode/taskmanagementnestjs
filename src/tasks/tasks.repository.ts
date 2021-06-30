import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      // :status is a variable (could be anything) -> is then used in the object {status: ..}
      // and is like the && in if f.e. -> Where looks for all entries where the task.status = status
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      // find any task where title or description are like search (like means not exactly the same, but partial result within the text), or is like ||
      // search provided with % -> means not looking for exactly that word -> look of independent parts
      // example: "Cle" matches "Clean"
      // LOWER makes everything lower case -> OPEN matches to open
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    // saves to db -> async
    await this.save(task);
    return task;
  }
}
