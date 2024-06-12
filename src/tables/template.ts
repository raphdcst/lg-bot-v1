import * as app from "#app"
import { UUID } from "crypto"

export interface Template {
  _id: UUID
  name: string
  "Infect Père Des Loups": number
  "Loup Garou Voyant": number
  "Chasseur": number
  "Sorcière": number
  "Cupidon": number
  "Loup-Garou": number
  "Voyante": number
  "Petite Fille": number
  "Pyromane": number
  "Chaman": number
  "Enfant Sauvage": number
  "Loup Garou Blanc": number
  "Salvateur": number
  "Renard": number
}

export default new app.Table<Template>({
  name: "template",
  setup: (table) => {
    table.increments("_id", { primaryKey: true }).unsigned()
    table.string("name").notNullable().unique()
    table.integer("Infect Pere Des Loups").defaultTo(0)
    table.integer("Loup Garou Voyant").defaultTo(0)
    table.integer("Chasseur").defaultTo(0)
    table.integer("Sorciere").defaultTo(0)
    table.integer("Cupidon").defaultTo(0)
    table.integer("Loup Garou").defaultTo(0)
    table.integer("Voyante").defaultTo(0)
    table.integer("Petite Fille").defaultTo(0)
    table.integer("Pyromane").defaultTo(0)
    table.integer("Chaman").defaultTo(0)
    table.integer("Enfant Sauvage").defaultTo(0)
    table.integer("Loup Garou Blanc").defaultTo(0)
    table.integer("Salvateur").defaultTo(0)
    table.integer("Renard").defaultTo(0)
  },
})