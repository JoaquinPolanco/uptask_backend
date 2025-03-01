import type { Request, Response } from 'express'
import Project from '../models/project'
import { populate } from 'dotenv'

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        //asigna manager
        project.manager = req.user.id
        console.log(req.user);

        try {
            await project.save(req.body)
            res.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } }
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error);

        }


    }
    static getProjectsByID = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            if (!project) {
                const error = new Error('Proyecto no econtrodado')
                return res.status(400).json({ error: error.message })
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Accion no valida')
                return res.status(400).json({ error: error.message })
            }
            res.json(project)
        } catch (error) {
            console.log(error);
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description
            await req.project.save()
            res.send('Proyecto Actualizado')

        } catch (error) {
            console.log(error);

        }

    }
    static deleteProject = async (req: Request, res: Response) => {

        try {
            await req.project.deleteOne()
            res.send('Proyecto Eliminado')
        } catch (error) {
            console.log(error);

        }

    }
}