ALTER TABLE public.forum_threads
  ADD CONSTRAINT forum_threads_title_len CHECK (char_length(title) BETWEEN 1 AND 200) NOT VALID,
  ADD CONSTRAINT forum_threads_body_len CHECK (char_length(body) BETWEEN 1 AND 10000) NOT VALID,
  ADD CONSTRAINT forum_threads_category_len CHECK (char_length(category) BETWEEN 1 AND 40) NOT VALID;

ALTER TABLE public.forum_replies
  ADD CONSTRAINT forum_replies_body_len CHECK (char_length(body) BETWEEN 1 AND 5000) NOT VALID;