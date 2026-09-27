import { useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { LocalizedNameComponent, Persona, PronounSet } from '../types';
import { PersonaFormData } from '../components/PersonaStudioModal';

export function usePersonaManager() {
    const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const initialFormData: PersonaFormData = {
        persona_name: '',
        username: '',
        email_alias: '',
        legal_name: '',
        preferred_name: '',
        family_name: '',
        given_name: '',
        gender_identity: '',
        cultural_ordering: 'given_family',
        primary_script: 'latin',
        localized_names: {} as Record<string, LocalizedNameComponent>,
        pronouns: { subject: 'they', object: 'them', possessive: 'theirs', display: 'they/them' } as PronounSet,
    };

    const { data, setData, post, put, reset, processing, errors } = useForm<PersonaFormData>(initialFormData);

    const startEdit = (persona: Persona) => {
        setEditingPersona(persona);
        setData({
            persona_name: persona.persona_name || '',
            username: persona.username || '',
            email_alias: persona.email_alias || '',
            legal_name: persona.legal_name || '',
            preferred_name: persona.preferred_name || '',
            family_name: persona.family_name || '',
            given_name: persona.given_name || '',
            gender_identity: persona.gender_identity || '',
            cultural_ordering: (persona.cultural_ordering as 'given_family' | 'family_given') || 'given_family',
            primary_script: persona.primary_script || 'latin',
            localized_names: persona.localized_names || {},
            pronouns: persona.pronouns || { subject: 'they', object: 'them', possessive: 'theirs', display: 'they/them' },
        });
    };

    const openCreateModal = () => {
        reset();
        setEditingPersona(null);
        setIsCreateOpen(true);
    };

    const closeModal = () => {
        setIsCreateOpen(false);
        setEditingPersona(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPersona) {
            put(`/personas/${editingPersona.id}`, {
                onSuccess: () => {
                    closeModal();
                },
                preserveScroll: true,
            });
        } else {
            post('/personas', {
                onSuccess: () => {
                    closeModal();
                },
                preserveScroll: true,
            });
        }
    };

    const handleDeletePersona = (personaId: number, name: string) => {
        if (confirm(`Are you sure you want to delete the persona "${name}"? This action is permanent.`)) {
            router.delete(`/personas/${personaId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleTogglePersonaAgeVerification = (personaId: number) => {
        router.post(`/personas/${personaId}/verify-age`, {}, {
            preserveScroll: true,
        });
    };

    const handleToggleMasterIal2 = () => {
        router.post('/verification/simulate-ial2', {}, {
            preserveScroll: true,
        });
    };

    const updateFormField = <K extends keyof PersonaFormData>(field: K, value: PersonaFormData[K]) => {
        setData(field as any, value as any);
    };

    return {
        editingPersona,
        isCreateOpen,
        isModalOpen: isCreateOpen || !!editingPersona,
        formData: data,
        processing,
        errors,
        startEdit,
        openCreateModal,
        closeModal,
        handleSubmit,
        handleDeletePersona,
        handleTogglePersonaAgeVerification,
        handleToggleMasterIal2,
        updateFormField,
    };
}
