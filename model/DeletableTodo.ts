export type DeletableTodo = {
  __typename?: 'todos' | undefined;
  created_at?: any;
  id: number;
  is_completed: boolean;
  is_public: boolean;
  title: string;
  user: {
    created_at: string;
    email: string;
    id: string;
    last_seen: string;
    name: string;
  };
  deletion_status: undefined | 'pending' | 'failed';
};
