import { relations } from "drizzle-orm";
import { pgTable, uuid, pgEnum, text, timestamp, integer, } from "drizzle-orm/pg-core";
import { emit } from "process";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const usersTableRelationships = relations(usersTable, ({ many }) => ({
    clinics: many(clinicsTable),
}));

export const clinicsTable = pgTable("clinics", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export const userToClinicsTable = pgTable("user_to_clinics", {
    userId: uuid("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clinicsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export const userToClinicsTableRelationships = relations(userToClinicsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userToClinicsTable.userId],
        references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
        fields: [userToClinicsTable.clinicId],
        references: [clinicsTable.id],
    }),
}));

export const clinicsTableRelationships = relations(clinicsTable, ({ many }) => ({
    doctors: many(doctorsTable),
    pattients: many(patientsTable),
    appointments: many(appointmentsTable),
    userToClinics: many(userToClinicsTable),
}));

export const doctorsTable = pgTable("doctors", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clinicsTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    avatarImageUrl: text("avatar_image_url"),
    availableFromWeekDay: text("available_from_week_day").notNull(),
    availableToWeekDay: text("available_to_week_day").notNull(),
    availableFromTime: text("available_from_time").notNull(),
    availableToTime: text("available_to_time").notNull(),
    appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
    specialty: text("specialty").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export const doctorsTableRelationships = relations(doctorsTable, ({ one, many }) => ({
    clinic: one(clinicsTable, {
        fields: [doctorsTable.clinicId],
        references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
}));

export const patientSexEnum = pgEnum("patient_sex", ["male", "female", "other"]);

export const patientsTable = pgTable("patients", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clinicsTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phoneNumber: text("phone_number").notNull(),
    sex: patientSexEnum("sex").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export const patientsTableRelationships = relations(patientsTable, ({ one, many }) => ({
    clinic: one(clinicsTable, {
        fields: [patientsTable.clinicId],
        references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
}));

export const appointmentsTable = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    date: timestamp("date").notNull(),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clinicsTable.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
        .notNull()
        .references(() => patientsTable.id, { onDelete: "cascade" }),
    doctorId: uuid("doctor_id")
        .notNull()
        .references(() => doctorsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export const appointmentsTableRelationships = relations(appointmentsTable, ({ one }) => ({
    clinic: one(clinicsTable, {
        fields: [appointmentsTable.clinicId],
        references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
        fields: [appointmentsTable.patientId],
        references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
        fields: [appointmentsTable.doctorId],
        references: [doctorsTable.id],
    }),
}));
