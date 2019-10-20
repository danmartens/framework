import generate from '@babel/generator';

import Schema from '../Schema';

describe('Schema', () => {
  test('works', () => {
    const schema = Schema.fromSQL(`
    SET statement_timeout = 0;
    SET lock_timeout = 0;
    SET idle_in_transaction_session_timeout = 0;
    SET client_encoding = 'UTF8';
    SET standard_conforming_strings = on;
    SELECT pg_catalog.set_config('search_path', '', false);
    SET check_function_bodies = false;
    SET client_min_messages = warning;
    SET row_security = off;

    --
    -- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
    --

    CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


    --
    -- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
    --

    COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


    --
    -- Name: citext; Type: EXTENSION; Schema: -; Owner: -
    --

    CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


    --
    -- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
    --

    COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


    --
    -- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
    --

    CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


    --
    -- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: -
    --

    COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


    --
    -- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
    --

    CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


    --
    -- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
    --

    COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


    SET default_tablespace = '';

    SET default_with_oids = false;

    --
    -- Name: active_storage_attachments; Type: TABLE; Schema: public; Owner: -
    --

    CREATE TABLE public.active_storage_attachments (
        id bigint NOT NULL,
        name character varying NOT NULL,
        record_type character varying NOT NULL,
        record_id bigint NOT NULL,
        blob_id bigint NOT NULL,
        created_at timestamp without time zone NOT NULL
    );


    --
    -- Name: active_storage_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
    --

    CREATE SEQUENCE public.active_storage_attachments_id_seq
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    --
    -- Name: active_storage_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
    --

    ALTER SEQUENCE public.active_storage_attachments_id_seq OWNED BY public.active_storage_attachments.id;


    --
    -- Name: active_storage_blobs; Type: TABLE; Schema: public; Owner: -
    --

    CREATE TABLE public.active_storage_blobs (
        id bigint NOT NULL,
        key character varying NOT NULL,
        filename character varying NOT NULL,
        content_type character varying,
        metadata text,
        byte_size bigint NOT NULL,
        checksum character varying NOT NULL,
        created_at timestamp without time zone NOT NULL
    );


    --
    -- Name: active_storage_blobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
    --

    CREATE SEQUENCE public.active_storage_blobs_id_seq
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    --
    -- Name: active_storage_blobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
    --

    ALTER SEQUENCE public.active_storage_blobs_id_seq OWNED BY public.active_storage_blobs.id;


    --
    -- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
    --

    CREATE TABLE public.ar_internal_metadata (
        key character varying NOT NULL,
        value character varying,
        created_at timestamp without time zone NOT NULL,
        updated_at timestamp without time zone NOT NULL
    );


    --
    -- Name: projects; Type: TABLE; Schema: public; Owner: -
    --

    CREATE TABLE public.projects (
        id uuid DEFAULT public.gen_random_uuid() NOT NULL,
        creator_id uuid NOT NULL,
        name public.citext NOT NULL,
        blurb text,
        description text,
        country_alpha2 character varying,
        currency_code character varying,
        visible boolean DEFAULT false NOT NULL,
        listed boolean DEFAULT false NOT NULL,
        discovery_enabled boolean DEFAULT false NOT NULL,
        comments_enabled boolean DEFAULT false NOT NULL,
        published_at timestamp without time zone,
        created_at timestamp without time zone NOT NULL,
        updated_at timestamp without time zone NOT NULL
    );


    --
    -- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
    --

    CREATE TABLE public.schema_migrations (
        version character varying NOT NULL
    );


    --
    -- Name: users; Type: TABLE; Schema: public; Owner: -
    --

    CREATE TABLE public.users (
        id uuid DEFAULT public.gen_random_uuid() NOT NULL,
        email public.citext DEFAULT ''::public.citext,
        encrypted_password character varying DEFAULT ''::character varying NOT NULL,
        reset_password_token character varying,
        reset_password_sent_at timestamp without time zone,
        remember_created_at timestamp without time zone,
        sign_in_count integer DEFAULT 0 NOT NULL,
        current_sign_in_at timestamp without time zone,
        last_sign_in_at timestamp without time zone,
        current_sign_in_ip inet,
        last_sign_in_ip inet,
        confirmation_token character varying,
        confirmed_at timestamp without time zone,
        confirmation_sent_at timestamp without time zone,
        unconfirmed_email character varying,
        name character varying DEFAULT ''::character varying NOT NULL,
        created_at timestamp without time zone NOT NULL,
        updated_at timestamp without time zone NOT NULL,
        twitter_uid character varying,
        twitter_username character varying,
        twitter_profile_image_url character varying,
        twitter_access_token character varying,
        twitter_access_secret character varying,
        roles integer[] DEFAULT '{}'::integer[],
        pronoun character varying,
        introduction text,
        page_slug public.citext
    );


    --
    -- Name: active_storage_attachments id; Type: DEFAULT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.active_storage_attachments ALTER COLUMN id SET DEFAULT nextval('public.active_storage_attachments_id_seq'::regclass);


    --
    -- Name: active_storage_blobs id; Type: DEFAULT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.active_storage_blobs ALTER COLUMN id SET DEFAULT nextval('public.active_storage_blobs_id_seq'::regclass);


    --
    -- Name: active_storage_attachments active_storage_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.active_storage_attachments
        ADD CONSTRAINT active_storage_attachments_pkey PRIMARY KEY (id);


    --
    -- Name: active_storage_blobs active_storage_blobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.active_storage_blobs
        ADD CONSTRAINT active_storage_blobs_pkey PRIMARY KEY (id);


    --
    -- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.ar_internal_metadata
        ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


    --
    -- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.projects
        ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


    --
    -- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.schema_migrations
        ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


    --
    -- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.users
        ADD CONSTRAINT users_pkey PRIMARY KEY (id);


    --
    -- Name: index_active_storage_attachments_on_blob_id; Type: INDEX; Schema: public; Owner: -
    --

    CREATE INDEX index_active_storage_attachments_on_blob_id ON public.active_storage_attachments USING btree (blob_id);


    --
    -- Name: index_active_storage_attachments_uniqueness; Type: INDEX; Schema: public; Owner: -
    --

    CREATE UNIQUE INDEX index_active_storage_attachments_uniqueness ON public.active_storage_attachments USING btree (record_type, record_id, name, blob_id);


    --
    -- Name: index_active_storage_blobs_on_key; Type: INDEX; Schema: public; Owner: -
    --

    CREATE UNIQUE INDEX index_active_storage_blobs_on_key ON public.active_storage_blobs USING btree (key);


    --
    -- Name: index_projects_on_creator_id; Type: INDEX; Schema: public; Owner: -
    --

    CREATE INDEX index_projects_on_creator_id ON public.projects USING btree (creator_id);


    --
    -- Name: index_projects_on_name; Type: INDEX; Schema: public; Owner: -
    --

    CREATE UNIQUE INDEX index_projects_on_name ON public.projects USING btree (name);


    --
    -- Name: index_users_on_confirmation_token; Type: INDEX; Schema: public; Owner: -
    --

    CREATE UNIQUE INDEX index_users_on_confirmation_token ON public.users USING btree (confirmation_token);


    --
    -- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
    --

    CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);


    --
    -- Name: index_users_on_page_slug; Type: INDEX; Schema: public; Owner: -
    --

    CREATE UNIQUE INDEX index_users_on_page_slug ON public.users USING btree (page_slug);


    --
    -- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: -
    --

    CREATE UNIQUE INDEX index_users_on_reset_password_token ON public.users USING btree (reset_password_token);


    --
    -- Name: index_users_on_roles; Type: INDEX; Schema: public; Owner: -
    --

    CREATE INDEX index_users_on_roles ON public.users USING gin (roles public.gin__int_ops);


    --
    -- Name: projects fk_rails_03ec10b0d3; Type: FK CONSTRAINT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.projects
        ADD CONSTRAINT fk_rails_03ec10b0d3 FOREIGN KEY (creator_id) REFERENCES public.users(id);


    --
    -- Name: active_storage_attachments fk_rails_c3b3935057; Type: FK CONSTRAINT; Schema: public; Owner: -
    --

    ALTER TABLE ONLY public.active_storage_attachments
        ADD CONSTRAINT fk_rails_c3b3935057 FOREIGN KEY (blob_id) REFERENCES public.active_storage_blobs(id);


    --
    -- PostgreSQL database dump complete
    --

    SET search_path TO "$user", public;

    INSERT INTO "schema_migrations" (version) VALUES
    ('0'),
    ('20190506203533'),
    ('20190509200655'),
    ('20190517131920'),
    ('20190522154934'),
    ('20190522181542'),
    ('20190528134053');




    `);

    schema.tables.forEach(table =>
      console.log(generate(table.toTypeScriptType()).code)
    );
  });
});
