// Generic relational field type definitions (Odoo-style)
export type FieldType = 'selection' | 'many2one' | 'one2many' | 'many2many' | 'char' | 'text' | 'integer' | 'float' | 'boolean' | 'date' | 'datetime';

export interface SelectionOption { value: string; label: string; color?: string; }

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  readonly?: boolean;
  help?: string;
  // selection
  options?: SelectionOption[];
  // many2one / many2many
  relation?: string; // target model name
  // one2many
  inverseField?: string;
}
