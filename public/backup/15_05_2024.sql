PGDMP                          |            POS    15.4    15.4 �    9           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            :           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ;           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            <           1262    154422    POS    DATABASE     z   CREATE DATABASE "POS" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Bolivia.1252';
    DROP DATABASE "POS";
                postgres    false                        2615    220178    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            =           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   postgres    false    5            >           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    5            �           1247    220651    StateInvitation    TYPE     `   CREATE TYPE public."StateInvitation" AS ENUM (
    'Espera',
    'Aceptado',
    'Cancelado'
);
 $   DROP TYPE public."StateInvitation";
       public          postgres    false    5            w           1247    220287    TypeAtm    TYPE     G   CREATE TYPE public."TypeAtm" AS ENUM (
    'Apertura',
    'Cierre'
);
    DROP TYPE public."TypeAtm";
       public          postgres    false    5            �            1259    220294    Atm    TABLE     l  CREATE TABLE public."Atm" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "branchId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."Atm";
       public         heap    postgres    false    5            �            1259    220293 
   Atm_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Atm_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public."Atm_id_seq";
       public          postgres    false    220    5            ?           0    0 
   Atm_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public."Atm_id_seq" OWNED BY public."Atm".id;
          public          postgres    false    219            �            1259    220250    Branch    TABLE     �  CREATE TABLE public."Branch" (
    id integer NOT NULL,
    address character varying(60) NOT NULL,
    name character varying(50) NOT NULL,
    lat numeric NOT NULL,
    lng numeric NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "cityId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."Branch";
       public         heap    postgres    false    5            �            1259    220249    Branch_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Branch_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Branch_id_seq";
       public          postgres    false    5    216            @           0    0    Branch_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Branch_id_seq" OWNED BY public."Branch".id;
          public          postgres    false    215            �            1259    220543    Buys    TABLE     �  CREATE TABLE public."Buys" (
    id integer NOT NULL,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total numeric(10,2) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "userId" uuid NOT NULL,
    "providerId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."Buys";
       public         heap    postgres    false    5            �            1259    220542    Buys_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Buys_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."Buys_id_seq";
       public          postgres    false    5    245            A           0    0    Buys_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."Buys_id_seq" OWNED BY public."Buys".id;
          public          postgres    false    244            �            1259    220421    Category    TABLE     F  CREATE TABLE public."Category" (
    id integer NOT NULL,
    description text NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."Category";
       public         heap    postgres    false    5            �            1259    220531    CategoryProduct    TABLE     o   CREATE TABLE public."CategoryProduct" (
    "categoryId" integer NOT NULL,
    "productId" integer NOT NULL
);
 %   DROP TABLE public."CategoryProduct";
       public         heap    postgres    false    5            �            1259    220420    Category_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Category_id_seq";
       public          postgres    false    231    5            B           0    0    Category_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;
          public          postgres    false    230            �            1259    220262    City    TABLE     R  CREATE TABLE public."City" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(1) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."City";
       public         heap    postgres    false    5            �            1259    220261    City_id_seq    SEQUENCE     �   CREATE SEQUENCE public."City_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."City_id_seq";
       public          postgres    false    5    218            C           0    0    City_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."City_id_seq" OWNED BY public."City".id;
          public          postgres    false    217            �            1259    220578    Client    TABLE     u  CREATE TABLE public."Client" (
    id uuid NOT NULL,
    email character varying(60) NOT NULL,
    name character varying(50) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."Client";
       public         heap    postgres    false    5            �            1259    220305 
   ControlATM    TABLE       CREATE TABLE public."ControlATM" (
    id integer NOT NULL,
    monto numeric(10,2) NOT NULL,
    type public."TypeAtm" NOT NULL,
    "employeeId" uuid NOT NULL,
    "atmId" integer NOT NULL,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
     DROP TABLE public."ControlATM";
       public         heap    postgres    false    5    887            �            1259    220304    ControlATM_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ControlATM_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."ControlATM_id_seq";
       public          postgres    false    222    5            D           0    0    ControlATM_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."ControlATM_id_seq" OWNED BY public."ControlATM".id;
          public          postgres    false    221            �            1259    220536    DetailsBuys    TABLE     �   CREATE TABLE public."DetailsBuys" (
    "productId" integer NOT NULL,
    "buyId" integer NOT NULL,
    cant integer NOT NULL,
    import numeric(10,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 !   DROP TABLE public."DetailsBuys";
       public         heap    postgres    false    5            �            1259    220561    DetailsSales    TABLE     �   CREATE TABLE public."DetailsSales" (
    "saleId" integer NOT NULL,
    "productId" integer NOT NULL,
    cant integer NOT NULL,
    import numeric(10,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 "   DROP TABLE public."DetailsSales";
       public         heap    postgres    false    5            �            1259    220493 	   Inventory    TABLE        CREATE TABLE public."Inventory" (
    "branchId" integer NOT NULL,
    "stockId" integer NOT NULL,
    cant integer NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public."Inventory";
       public         heap    postgres    false    5            �            1259    220658    InvitationTenant    TABLE     x  CREATE TABLE public."InvitationTenant" (
    id integer NOT NULL,
    "tenantId" integer NOT NULL,
    "userId" uuid NOT NULL,
    state public."StateInvitation" NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 &   DROP TABLE public."InvitationTenant";
       public         heap    postgres    false    956    5            �            1259    220657    InvitationTenant_id_seq    SEQUENCE     �   CREATE SEQUENCE public."InvitationTenant_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public."InvitationTenant_id_seq";
       public          postgres    false    5    254            E           0    0    InvitationTenant_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public."InvitationTenant_id_seq" OWNED BY public."InvitationTenant".id;
          public          postgres    false    253            �            1259    220477    Module    TABLE     c   CREATE TABLE public."Module" (
    id integer NOT NULL,
    name character varying(60) NOT NULL
);
    DROP TABLE public."Module";
       public         heap    postgres    false    5            �            1259    220476    Module_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Module_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Module_id_seq";
       public          postgres    false    238    5            F           0    0    Module_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Module_id_seq" OWNED BY public."Module".id;
          public          postgres    false    237            �            1259    220587    PaymentMethod    TABLE       CREATE TABLE public."PaymentMethod" (
    id integer NOT NULL,
    description character varying(60) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 #   DROP TABLE public."PaymentMethod";
       public         heap    postgres    false    5            �            1259    220586    PaymentMethod_id_seq    SEQUENCE     �   CREATE SEQUENCE public."PaymentMethod_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."PaymentMethod_id_seq";
       public          postgres    false    5    252            G           0    0    PaymentMethod_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."PaymentMethod_id_seq" OWNED BY public."PaymentMethod".id;
          public          postgres    false    251            �            1259    220470 
   Permission    TABLE     _  CREATE TABLE public."Permission" (
    "rolId" integer NOT NULL,
    "moduleId" integer NOT NULL,
    get boolean NOT NULL,
    "create" boolean NOT NULL,
    edit boolean NOT NULL,
    delete boolean NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL,
    id integer NOT NULL
);
     DROP TABLE public."Permission";
       public         heap    postgres    false    5            �            1259    224204    Permission_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Permission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Permission_id_seq";
       public          postgres    false    236    5            H           0    0    Permission_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Permission_id_seq" OWNED BY public."Permission".id;
          public          postgres    false    255            �            1259    220438    Product    TABLE     �  CREATE TABLE public."Product" (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    discount numeric(5,2) DEFAULT 0 NOT NULL,
    status boolean DEFAULT true NOT NULL,
    images text[] DEFAULT ARRAY[]::text[],
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."Product";
       public         heap    postgres    false    5            �            1259    220437    Product_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Product_id_seq";
       public          postgres    false    233    5            I           0    0    Product_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;
          public          postgres    false    232            �            1259    220553    Provider    TABLE     �  CREATE TABLE public."Provider" (
    id uuid NOT NULL,
    email character varying(50) NOT NULL,
    name character varying(60) NOT NULL,
    phone character varying(8) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."Provider";
       public         heap    postgres    false    5            �            1259    220462    Rol    TABLE     b   CREATE TABLE public."Rol" (
    id integer NOT NULL,
    "desc" character varying(60) NOT NULL
);
    DROP TABLE public."Rol";
       public         heap    postgres    false    5            �            1259    220461 
   Rol_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Rol_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public."Rol_id_seq";
       public          postgres    false    235    5            J           0    0 
   Rol_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public."Rol_id_seq" OWNED BY public."Rol".id;
          public          postgres    false    234            �            1259    220568    Sales    TABLE     _  CREATE TABLE public."Sales" (
    id integer NOT NULL,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total numeric(10,2) NOT NULL,
    pay numeric(10,2) NOT NULL,
    change numeric(10,2) NOT NULL,
    "nitClient" character varying(20),
    status boolean DEFAULT true NOT NULL,
    "atmId" integer NOT NULL,
    "clientId" uuid NOT NULL,
    "paymentMethodId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."Sales";
       public         heap    postgres    false    5            �            1259    220567    Sales_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Sales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Sales_id_seq";
       public          postgres    false    249    5            K           0    0    Sales_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Sales_id_seq" OWNED BY public."Sales".id;
          public          postgres    false    248            �            1259    220486    Stock    TABLE     �   CREATE TABLE public."Stock" (
    id integer NOT NULL,
    "cantTotal" integer NOT NULL,
    "productId" integer NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);
    DROP TABLE public."Stock";
       public         heap    postgres    false    5            �            1259    220485    Stock_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Stock_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Stock_id_seq";
       public          postgres    false    240    5            L           0    0    Stock_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Stock_id_seq" OWNED BY public."Stock".id;
          public          postgres    false    239            �            1259    220340    Suscription    TABLE     s  CREATE TABLE public."Suscription" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    duracion integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status boolean DEFAULT true NOT NULL,
    price numeric(10,2) NOT NULL
);
 !   DROP TABLE public."Suscription";
       public         heap    postgres    false    5            �            1259    220339    Suscription_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Suscription_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Suscription_id_seq";
       public          postgres    false    5    224            M           0    0    Suscription_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Suscription_id_seq" OWNED BY public."Suscription".id;
          public          postgres    false    223            �            1259    220349    Tenant    TABLE       CREATE TABLE public."Tenant" (
    id integer NOT NULL,
    hosting text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status boolean DEFAULT true NOT NULL
);
    DROP TABLE public."Tenant";
       public         heap    postgres    false    5            �            1259    220348    Tenant_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Tenant_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Tenant_id_seq";
       public          postgres    false    5    226            N           0    0    Tenant_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Tenant_id_seq" OWNED BY public."Tenant".id;
          public          postgres    false    225            �            1259    220369    User    TABLE     �  CREATE TABLE public."User" (
    id uuid NOT NULL,
    email character varying(50) NOT NULL,
    password text NOT NULL,
    name character varying(50) NOT NULL,
    phone character varying(8) NOT NULL,
    photo text,
    status boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public."User";
       public         heap    postgres    false    5            �            1259    220179    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    postgres    false    5            �            1259    220364    memberTenant    TABLE     �   CREATE TABLE public."memberTenant" (
    "userId" uuid NOT NULL,
    "tenantId" integer NOT NULL,
    "passwordTenant" text NOT NULL,
    "rolId" integer NOT NULL
);
 "   DROP TABLE public."memberTenant";
       public         heap    postgres    false    5            �            1259    220359    paymentMembreship    TABLE     �   CREATE TABLE public."paymentMembreship" (
    "tenantId" integer NOT NULL,
    "suscriptionId" integer NOT NULL,
    "endTime" timestamp without time zone NOT NULL,
    "startTime" timestamp without time zone NOT NULL
);
 '   DROP TABLE public."paymentMembreship";
       public         heap    postgres    false    5            �           2604    220297    Atm id    DEFAULT     d   ALTER TABLE ONLY public."Atm" ALTER COLUMN id SET DEFAULT nextval('public."Atm_id_seq"'::regclass);
 7   ALTER TABLE public."Atm" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            �           2604    220253 	   Branch id    DEFAULT     j   ALTER TABLE ONLY public."Branch" ALTER COLUMN id SET DEFAULT nextval('public."Branch_id_seq"'::regclass);
 :   ALTER TABLE public."Branch" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216                       2604    220546    Buys id    DEFAULT     f   ALTER TABLE ONLY public."Buys" ALTER COLUMN id SET DEFAULT nextval('public."Buys_id_seq"'::regclass);
 8   ALTER TABLE public."Buys" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    244    245    245            �           2604    220424    Category id    DEFAULT     n   ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);
 <   ALTER TABLE public."Category" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    231    231            �           2604    220265    City id    DEFAULT     f   ALTER TABLE ONLY public."City" ALTER COLUMN id SET DEFAULT nextval('public."City_id_seq"'::regclass);
 8   ALTER TABLE public."City" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            �           2604    220308    ControlATM id    DEFAULT     r   ALTER TABLE ONLY public."ControlATM" ALTER COLUMN id SET DEFAULT nextval('public."ControlATM_id_seq"'::regclass);
 >   ALTER TABLE public."ControlATM" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222                        2604    220661    InvitationTenant id    DEFAULT     ~   ALTER TABLE ONLY public."InvitationTenant" ALTER COLUMN id SET DEFAULT nextval('public."InvitationTenant_id_seq"'::regclass);
 D   ALTER TABLE public."InvitationTenant" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    253    254    254                       2604    220480 	   Module id    DEFAULT     j   ALTER TABLE ONLY public."Module" ALTER COLUMN id SET DEFAULT nextval('public."Module_id_seq"'::regclass);
 :   ALTER TABLE public."Module" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    237    238    238                       2604    220590    PaymentMethod id    DEFAULT     x   ALTER TABLE ONLY public."PaymentMethod" ALTER COLUMN id SET DEFAULT nextval('public."PaymentMethod_id_seq"'::regclass);
 A   ALTER TABLE public."PaymentMethod" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    251    252    252                       2604    224205    Permission id    DEFAULT     r   ALTER TABLE ONLY public."Permission" ALTER COLUMN id SET DEFAULT nextval('public."Permission_id_seq"'::regclass);
 >   ALTER TABLE public."Permission" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    255    236            �           2604    220441 
   Product id    DEFAULT     l   ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);
 ;   ALTER TABLE public."Product" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    233    233                       2604    220465    Rol id    DEFAULT     d   ALTER TABLE ONLY public."Rol" ALTER COLUMN id SET DEFAULT nextval('public."Rol_id_seq"'::regclass);
 7   ALTER TABLE public."Rol" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    234    235                       2604    220571    Sales id    DEFAULT     h   ALTER TABLE ONLY public."Sales" ALTER COLUMN id SET DEFAULT nextval('public."Sales_id_seq"'::regclass);
 9   ALTER TABLE public."Sales" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    248    249    249                       2604    220489    Stock id    DEFAULT     h   ALTER TABLE ONLY public."Stock" ALTER COLUMN id SET DEFAULT nextval('public."Stock_id_seq"'::regclass);
 9   ALTER TABLE public."Stock" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    240    239    240            �           2604    220343    Suscription id    DEFAULT     t   ALTER TABLE ONLY public."Suscription" ALTER COLUMN id SET DEFAULT nextval('public."Suscription_id_seq"'::regclass);
 ?   ALTER TABLE public."Suscription" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    220352 	   Tenant id    DEFAULT     j   ALTER TABLE ONLY public."Tenant" ALTER COLUMN id SET DEFAULT nextval('public."Tenant_id_seq"'::regclass);
 :   ALTER TABLE public."Tenant" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225    226                      0    220294    Atm 
   TABLE DATA           c   COPY public."Atm" (id, name, status, "branchId", "createdAt", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    220                      0    220250    Branch 
   TABLE DATA           w   COPY public."Branch" (id, address, name, lat, lng, status, "cityId", "createdAt", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    216            ,          0    220543    Buys 
   TABLE DATA           y   COPY public."Buys" (id, "time", total, status, "userId", "providerId", "createdAt", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    245                      0    220421    Category 
   TABLE DATA           c   COPY public."Category" (id, description, status, "createdAt", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    231            )          0    220531    CategoryProduct 
   TABLE DATA           F   COPY public."CategoryProduct" ("categoryId", "productId") FROM stdin;
    public          postgres    false    242                      0    220262    City 
   TABLE DATA           X   COPY public."City" (id, name, status, "createdAt", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    218            1          0    220578    Client 
   TABLE DATA           a   COPY public."Client" (id, email, name, status, "createdAt", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    250                      0    220305 
   ControlATM 
   TABLE DATA           V   COPY public."ControlATM" (id, monto, type, "employeeId", "atmId", "time") FROM stdin;
    public          postgres    false    222            *          0    220536    DetailsBuys 
   TABLE DATA           X   COPY public."DetailsBuys" ("productId", "buyId", cant, import, "createdAt") FROM stdin;
    public          postgres    false    243            .          0    220561    DetailsSales 
   TABLE DATA           Z   COPY public."DetailsSales" ("saleId", "productId", cant, import, "createdAt") FROM stdin;
    public          postgres    false    247            (          0    220493 	   Inventory 
   TABLE DATA           \   COPY public."Inventory" ("branchId", "stockId", cant, "updatedAt", "createdAt") FROM stdin;
    public          postgres    false    241            5          0    220658    InvitationTenant 
   TABLE DATA           o   COPY public."InvitationTenant" (id, "tenantId", "userId", state, status, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    254            %          0    220477    Module 
   TABLE DATA           ,   COPY public."Module" (id, name) FROM stdin;
    public          postgres    false    238            3          0    220587    PaymentMethod 
   TABLE DATA           T   COPY public."PaymentMethod" (id, description, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    252            #          0    220470 
   Permission 
   TABLE DATA           u   COPY public."Permission" ("rolId", "moduleId", get, "create", edit, delete, "updatedAt", "tenantId", id) FROM stdin;
    public          postgres    false    236                       0    220438    Product 
   TABLE DATA           �   COPY public."Product" (id, name, description, price, discount, status, images, "createdAt", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    233            -          0    220553    Provider 
   TABLE DATA           j   COPY public."Provider" (id, email, name, phone, status, "createdAt", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    246            "          0    220462    Rol 
   TABLE DATA           +   COPY public."Rol" (id, "desc") FROM stdin;
    public          postgres    false    235            0          0    220568    Sales 
   TABLE DATA           �   COPY public."Sales" (id, "time", total, pay, change, "nitClient", status, "atmId", "clientId", "paymentMethodId", "createdAt", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    249            '          0    220486    Stock 
   TABLE DATA           X   COPY public."Stock" (id, "cantTotal", "productId", "updatedAt", "tenantId") FROM stdin;
    public          postgres    false    240                      0    220340    Suscription 
   TABLE DATA           d   COPY public."Suscription" (id, name, duracion, "createdAt", "updatedAt", status, price) FROM stdin;
    public          postgres    false    224                      0    220349    Tenant 
   TABLE DATA           Q   COPY public."Tenant" (id, hosting, "createdAt", "updatedAt", status) FROM stdin;
    public          postgres    false    226                      0    220369    User 
   TABLE DATA           k   COPY public."User" (id, email, password, name, phone, photo, status, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    229                      0    220179    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          postgres    false    214                      0    220364    memberTenant 
   TABLE DATA           Y   COPY public."memberTenant" ("userId", "tenantId", "passwordTenant", "rolId") FROM stdin;
    public          postgres    false    228                      0    220359    paymentMembreship 
   TABLE DATA           b   COPY public."paymentMembreship" ("tenantId", "suscriptionId", "endTime", "startTime") FROM stdin;
    public          postgres    false    227            O           0    0 
   Atm_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."Atm_id_seq"', 1, false);
          public          postgres    false    219            P           0    0    Branch_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Branch_id_seq"', 1, false);
          public          postgres    false    215            Q           0    0    Buys_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Buys_id_seq"', 1, false);
          public          postgres    false    244            R           0    0    Category_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Category_id_seq"', 6, true);
          public          postgres    false    230            S           0    0    City_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."City_id_seq"', 1, false);
          public          postgres    false    217            T           0    0    ControlATM_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."ControlATM_id_seq"', 1, false);
          public          postgres    false    221            U           0    0    InvitationTenant_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."InvitationTenant_id_seq"', 1, false);
          public          postgres    false    253            V           0    0    Module_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Module_id_seq"', 8, true);
          public          postgres    false    237            W           0    0    PaymentMethod_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."PaymentMethod_id_seq"', 3, true);
          public          postgres    false    251            X           0    0    Permission_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Permission_id_seq"', 132, true);
          public          postgres    false    255            Y           0    0    Product_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Product_id_seq"', 21, true);
          public          postgres    false    232            Z           0    0 
   Rol_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public."Rol_id_seq"', 3, true);
          public          postgres    false    234            [           0    0    Sales_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Sales_id_seq"', 1, false);
          public          postgres    false    248            \           0    0    Stock_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Stock_id_seq"', 9, true);
          public          postgres    false    239            ]           0    0    Suscription_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Suscription_id_seq"', 3, true);
          public          postgres    false    223            ^           0    0    Tenant_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Tenant_id_seq"', 6, true);
          public          postgres    false    225            +           2606    220303    Atm Atm_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public."Atm"
    ADD CONSTRAINT "Atm_pkey" PRIMARY KEY (id);
 :   ALTER TABLE ONLY public."Atm" DROP CONSTRAINT "Atm_pkey";
       public            postgres    false    220            '           2606    220260    Branch Branch_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Branch" DROP CONSTRAINT "Branch_pkey";
       public            postgres    false    216            L           2606    220552    Buys Buys_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."Buys"
    ADD CONSTRAINT "Buys_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."Buys" DROP CONSTRAINT "Buys_pkey";
       public            postgres    false    245            H           2606    220535 $   CategoryProduct CategoryProduct_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public."CategoryProduct"
    ADD CONSTRAINT "CategoryProduct_pkey" PRIMARY KEY ("categoryId", "productId");
 R   ALTER TABLE ONLY public."CategoryProduct" DROP CONSTRAINT "CategoryProduct_pkey";
       public            postgres    false    242    242            9           2606    220431    Category Category_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Category" DROP CONSTRAINT "Category_pkey";
       public            postgres    false    231            )           2606    220270    City City_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."City" DROP CONSTRAINT "City_pkey";
       public            postgres    false    218            T           2606    220585    Client Client_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Client" DROP CONSTRAINT "Client_pkey";
       public            postgres    false    250            -           2606    220312    ControlATM ControlATM_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."ControlATM"
    ADD CONSTRAINT "ControlATM_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."ControlATM" DROP CONSTRAINT "ControlATM_pkey";
       public            postgres    false    222            J           2606    220541    DetailsBuys DetailsBuys_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."DetailsBuys"
    ADD CONSTRAINT "DetailsBuys_pkey" PRIMARY KEY ("productId", "buyId");
 J   ALTER TABLE ONLY public."DetailsBuys" DROP CONSTRAINT "DetailsBuys_pkey";
       public            postgres    false    243    243            P           2606    220566    DetailsSales DetailsSales_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY public."DetailsSales"
    ADD CONSTRAINT "DetailsSales_pkey" PRIMARY KEY ("saleId", "productId");
 L   ALTER TABLE ONLY public."DetailsSales" DROP CONSTRAINT "DetailsSales_pkey";
       public            postgres    false    247    247            F           2606    220499    Inventory Inventory_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public."Inventory"
    ADD CONSTRAINT "Inventory_pkey" PRIMARY KEY ("branchId", "stockId");
 F   ALTER TABLE ONLY public."Inventory" DROP CONSTRAINT "Inventory_pkey";
       public            postgres    false    241    241            X           2606    220666 &   InvitationTenant InvitationTenant_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."InvitationTenant"
    ADD CONSTRAINT "InvitationTenant_pkey" PRIMARY KEY (id);
 T   ALTER TABLE ONLY public."InvitationTenant" DROP CONSTRAINT "InvitationTenant_pkey";
       public            postgres    false    254            A           2606    220484    Module Module_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Module"
    ADD CONSTRAINT "Module_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Module" DROP CONSTRAINT "Module_pkey";
       public            postgres    false    238            V           2606    220594     PaymentMethod PaymentMethod_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public."PaymentMethod"
    ADD CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY (id);
 N   ALTER TABLE ONLY public."PaymentMethod" DROP CONSTRAINT "PaymentMethod_pkey";
       public            postgres    false    252            ?           2606    224207    Permission Permission_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."Permission" DROP CONSTRAINT "Permission_pkey";
       public            postgres    false    236            ;           2606    220450    Product Product_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_pkey";
       public            postgres    false    233            N           2606    220560    Provider Provider_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Provider"
    ADD CONSTRAINT "Provider_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Provider" DROP CONSTRAINT "Provider_pkey";
       public            postgres    false    246            =           2606    220469    Rol Rol_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public."Rol"
    ADD CONSTRAINT "Rol_pkey" PRIMARY KEY (id);
 :   ALTER TABLE ONLY public."Rol" DROP CONSTRAINT "Rol_pkey";
       public            postgres    false    235            R           2606    220577    Sales Sales_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Sales" DROP CONSTRAINT "Sales_pkey";
       public            postgres    false    249            C           2606    220492    Stock Stock_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Stock" DROP CONSTRAINT "Stock_pkey";
       public            postgres    false    240            /           2606    220347    Suscription Suscription_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Suscription"
    ADD CONSTRAINT "Suscription_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Suscription" DROP CONSTRAINT "Suscription_pkey";
       public            postgres    false    224            1           2606    220358    Tenant Tenant_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Tenant"
    ADD CONSTRAINT "Tenant_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Tenant" DROP CONSTRAINT "Tenant_pkey";
       public            postgres    false    226            7           2606    220378    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public            postgres    false    229            %           2606    220187 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            postgres    false    214            5           2606    220368    memberTenant memberTenant_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public."memberTenant"
    ADD CONSTRAINT "memberTenant_pkey" PRIMARY KEY ("userId", "tenantId");
 L   ALTER TABLE ONLY public."memberTenant" DROP CONSTRAINT "memberTenant_pkey";
       public            postgres    false    228    228            3           2606    220363 (   paymentMembreship paymentMembreship_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."paymentMembreship"
    ADD CONSTRAINT "paymentMembreship_pkey" PRIMARY KEY ("tenantId", "suscriptionId");
 V   ALTER TABLE ONLY public."paymentMembreship" DROP CONSTRAINT "paymentMembreship_pkey";
       public            postgres    false    227    227            D           1259    220500    Stock_productId_key    INDEX     W   CREATE UNIQUE INDEX "Stock_productId_key" ON public."Stock" USING btree ("productId");
 )   DROP INDEX public."Stock_productId_key";
       public            postgres    false    240            \           2606    220313    Atm Atm_branchId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Atm"
    ADD CONSTRAINT "Atm_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 C   ALTER TABLE ONLY public."Atm" DROP CONSTRAINT "Atm_branchId_fkey";
       public          postgres    false    3367    216    220            ]           2606    220717    Atm Atm_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Atm"
    ADD CONSTRAINT "Atm_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 C   ALTER TABLE ONLY public."Atm" DROP CONSTRAINT "Atm_tenantId_fkey";
       public          postgres    false    226    3377    220            Y           2606    220276    Branch Branch_cityId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Branch" DROP CONSTRAINT "Branch_cityId_fkey";
       public          postgres    false    3369    216    218            Z           2606    220707    Branch Branch_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public."Branch" DROP CONSTRAINT "Branch_tenantId_fkey";
       public          postgres    false    226    3377    216            r           2606    220620    Buys Buys_providerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Buys"
    ADD CONSTRAINT "Buys_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES public."Provider"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Buys" DROP CONSTRAINT "Buys_providerId_fkey";
       public          postgres    false    3406    245    246            s           2606    220697    Buys Buys_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Buys"
    ADD CONSTRAINT "Buys_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public."Buys" DROP CONSTRAINT "Buys_tenantId_fkey";
       public          postgres    false    226    3377    245            t           2606    220615    Buys Buys_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Buys"
    ADD CONSTRAINT "Buys_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 C   ALTER TABLE ONLY public."Buys" DROP CONSTRAINT "Buys_userId_fkey";
       public          postgres    false    245    3383    229            n           2606    220595 /   CategoryProduct CategoryProduct_categoryId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CategoryProduct"
    ADD CONSTRAINT "CategoryProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 ]   ALTER TABLE ONLY public."CategoryProduct" DROP CONSTRAINT "CategoryProduct_categoryId_fkey";
       public          postgres    false    3385    231    242            o           2606    220600 .   CategoryProduct CategoryProduct_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CategoryProduct"
    ADD CONSTRAINT "CategoryProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 \   ALTER TABLE ONLY public."CategoryProduct" DROP CONSTRAINT "CategoryProduct_productId_fkey";
       public          postgres    false    3387    233    242            e           2606    220682    Category Category_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 M   ALTER TABLE ONLY public."Category" DROP CONSTRAINT "Category_tenantId_fkey";
       public          postgres    false    3377    226    231            [           2606    220712    City City_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public."City" DROP CONSTRAINT "City_tenantId_fkey";
       public          postgres    false    226    218    3377            |           2606    220727    Client Client_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public."Client" DROP CONSTRAINT "Client_tenantId_fkey";
       public          postgres    false    250    226    3377            ^           2606    220323     ControlATM ControlATM_atmId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ControlATM"
    ADD CONSTRAINT "ControlATM_atmId_fkey" FOREIGN KEY ("atmId") REFERENCES public."Atm"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public."ControlATM" DROP CONSTRAINT "ControlATM_atmId_fkey";
       public          postgres    false    222    3371    220            _           2606    220409 %   ControlATM ControlATM_employeeId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ControlATM"
    ADD CONSTRAINT "ControlATM_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY public."ControlATM" DROP CONSTRAINT "ControlATM_employeeId_fkey";
       public          postgres    false    222    229    3383            p           2606    220610 "   DetailsBuys DetailsBuys_buyId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."DetailsBuys"
    ADD CONSTRAINT "DetailsBuys_buyId_fkey" FOREIGN KEY ("buyId") REFERENCES public."Buys"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 P   ALTER TABLE ONLY public."DetailsBuys" DROP CONSTRAINT "DetailsBuys_buyId_fkey";
       public          postgres    false    3404    245    243            q           2606    220605 &   DetailsBuys DetailsBuys_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."DetailsBuys"
    ADD CONSTRAINT "DetailsBuys_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 T   ALTER TABLE ONLY public."DetailsBuys" DROP CONSTRAINT "DetailsBuys_productId_fkey";
       public          postgres    false    3387    233    243            v           2606    220630 (   DetailsSales DetailsSales_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."DetailsSales"
    ADD CONSTRAINT "DetailsSales_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 V   ALTER TABLE ONLY public."DetailsSales" DROP CONSTRAINT "DetailsSales_productId_fkey";
       public          postgres    false    233    3387    247            w           2606    220625 %   DetailsSales DetailsSales_saleId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."DetailsSales"
    ADD CONSTRAINT "DetailsSales_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES public."Sales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY public."DetailsSales" DROP CONSTRAINT "DetailsSales_saleId_fkey";
       public          postgres    false    249    247    3410            l           2606    220521 !   Inventory Inventory_branchId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Inventory"
    ADD CONSTRAINT "Inventory_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 O   ALTER TABLE ONLY public."Inventory" DROP CONSTRAINT "Inventory_branchId_fkey";
       public          postgres    false    3367    216    241            m           2606    220526     Inventory Inventory_stockId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Inventory"
    ADD CONSTRAINT "Inventory_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES public."Stock"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public."Inventory" DROP CONSTRAINT "Inventory_stockId_fkey";
       public          postgres    false    3395    241    240            }           2606    220667 /   InvitationTenant InvitationTenant_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."InvitationTenant"
    ADD CONSTRAINT "InvitationTenant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 ]   ALTER TABLE ONLY public."InvitationTenant" DROP CONSTRAINT "InvitationTenant_tenantId_fkey";
       public          postgres    false    3377    226    254            ~           2606    220672 -   InvitationTenant InvitationTenant_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."InvitationTenant"
    ADD CONSTRAINT "InvitationTenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 [   ALTER TABLE ONLY public."InvitationTenant" DROP CONSTRAINT "InvitationTenant_userId_fkey";
       public          postgres    false    254    3383    229            g           2606    220511 #   Permission Permission_moduleId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 Q   ALTER TABLE ONLY public."Permission" DROP CONSTRAINT "Permission_moduleId_fkey";
       public          postgres    false    3393    236    238            h           2606    220506     Permission Permission_rolId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public."Rol"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public."Permission" DROP CONSTRAINT "Permission_rolId_fkey";
       public          postgres    false    235    236    3389            i           2606    220677 #   Permission Permission_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 Q   ALTER TABLE ONLY public."Permission" DROP CONSTRAINT "Permission_tenantId_fkey";
       public          postgres    false    226    3377    236            f           2606    220687    Product Product_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 K   ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_tenantId_fkey";
       public          postgres    false    226    3377    233            u           2606    220702    Provider Provider_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Provider"
    ADD CONSTRAINT "Provider_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 M   ALTER TABLE ONLY public."Provider" DROP CONSTRAINT "Provider_tenantId_fkey";
       public          postgres    false    246    226    3377            x           2606    220635    Sales Sales_atmId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_atmId_fkey" FOREIGN KEY ("atmId") REFERENCES public."Atm"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 D   ALTER TABLE ONLY public."Sales" DROP CONSTRAINT "Sales_atmId_fkey";
       public          postgres    false    220    249    3371            y           2606    220640    Sales Sales_clientId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Sales" DROP CONSTRAINT "Sales_clientId_fkey";
       public          postgres    false    3412    249    250            z           2606    220645     Sales Sales_paymentMethodId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES public."PaymentMethod"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public."Sales" DROP CONSTRAINT "Sales_paymentMethodId_fkey";
       public          postgres    false    249    3414    252            {           2606    220722    Sales Sales_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Sales" DROP CONSTRAINT "Sales_tenantId_fkey";
       public          postgres    false    226    3377    249            j           2606    220516    Stock Stock_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 H   ALTER TABLE ONLY public."Stock" DROP CONSTRAINT "Stock_productId_fkey";
       public          postgres    false    240    3387    233            k           2606    220692    Stock Stock_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Stock" DROP CONSTRAINT "Stock_tenantId_fkey";
       public          postgres    false    240    226    3377            b           2606    220501 $   memberTenant memberTenant_rolId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."memberTenant"
    ADD CONSTRAINT "memberTenant_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public."Rol"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 R   ALTER TABLE ONLY public."memberTenant" DROP CONSTRAINT "memberTenant_rolId_fkey";
       public          postgres    false    3389    228    235            c           2606    220404 '   memberTenant memberTenant_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."memberTenant"
    ADD CONSTRAINT "memberTenant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 U   ALTER TABLE ONLY public."memberTenant" DROP CONSTRAINT "memberTenant_tenantId_fkey";
       public          postgres    false    228    3377    226            d           2606    220399 %   memberTenant memberTenant_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."memberTenant"
    ADD CONSTRAINT "memberTenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY public."memberTenant" DROP CONSTRAINT "memberTenant_userId_fkey";
       public          postgres    false    3383    229    228            `           2606    220389 6   paymentMembreship paymentMembreship_suscriptionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."paymentMembreship"
    ADD CONSTRAINT "paymentMembreship_suscriptionId_fkey" FOREIGN KEY ("suscriptionId") REFERENCES public."Suscription"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 d   ALTER TABLE ONLY public."paymentMembreship" DROP CONSTRAINT "paymentMembreship_suscriptionId_fkey";
       public          postgres    false    3375    224    227            a           2606    220384 1   paymentMembreship paymentMembreship_tenantId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."paymentMembreship"
    ADD CONSTRAINT "paymentMembreship_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 _   ALTER TABLE ONLY public."paymentMembreship" DROP CONSTRAINT "paymentMembreship_tenantId_fkey";
       public          postgres    false    227    3377    226                  x������ � �            x������ � �      ,      x������ � �         ]   x�u�1� @ѹ=�)�����]�q����&����`��� aI��vl9XV��t�
��{��y��d�[9�U?wp��U�b���A�� K@%�      )      x�3�42�2�42�21z\\\ U�            x������ � �      1      x������ � �            x������ � �      *      x������ � �      .      x������ � �      (      x������ � �      5      x������ � �      %   \   x��=
�0�9�a�u���%� 5[ϯnoy9MrFFAn�%9=.cT�8ʪ5��<{44�%��;ZL}Z�����x5�_�s�G\�      3   D   x�3�I,�J-I�4202�50�5�T02�20�2��332�%�e�D�&cN״��̲|����qqq x�#Q      #   �   x��л�@���
7 aɽ�jQ�f��I_4hh�L�+ǅ��xF=��m6�4:p	��`w�D
NBp9��ہ%x؃�pAg8��3K��-h?��p��3�t����pV�5�]��!��t�s	:ù��G�^)�/:Ë���x}�8          �   x�e�An1е���#۱3I���t�0�
U�V��w@�������O��R�/k]\_�����r]���;?*�8z"X����Pu��1l�c�s�I��?��;�"29��S	���7gGV���>1�Av����jN���?N�$0�@2���sQ�U���i��lS�� �CJ��%�WH��D7ɛ����D�      -   k   x�U�1!�N����aF�<����DbL������g#�~% �dZ��3��>7ij��{�����j�3�������$w��(�L�k�@(࿷�\���S��/QAF      "   1   x�3�tL����,.)JL�/�2�.-H-*�,r�9��R��b���� =C_      0      x������ � �      '   ?   x�Eʱ�0�ڞ"���e<K��R!]ye�u�{B��f���h��	�ԨF�/�p���         a   x�3��M�+.M��46�4202�50�5�T02�20�2��332�)^�in�gj�e�R���Z\R4ǒs��ps:��bfJ�!�@CL�b���� c^+�         =   x�3�,)JLJ��/�K������E��FF&����
�V��V&z��8�K�b���� G_N           x�u��n�0Eg�+X���ώ�T)�T!�ҁű��%���/E,U�p�p��{
a
�(MP��S�H�9�K ��ح��5O��lf���0�a�,�l�����U�6]��uSn�Eu��ݡn���-�jڄs!�/sp��D�D-�zNzC�=���(L�s`�I���BXN��&IQy&q҃!Ec������K�u{^�wf��)[���]Nߵ�^W�*也|T�O7�4[�>����.1��I���J��O��|�k��m�         k  x��Wn�7�{r����E���P��h��v����}θ�����<>����y[*f�j��Ϋ�:���j~��¬7��}L�L�6-�
���s��j��k�X1vgY�ękʒ����\)�s��rK���5�,x����������G^�_�}|_}�Q=@�t� �cx�^=y�֬}�R�n�T6�f3W*�EmK��$��2i�pͷ�e�m�5�U˒� Ϲw��_����>>ķ�|��8?>���>���H����B�C{��64UeM=b%�[v5:���x������C��Ý��I�k�����O>M)3����������b;�X�y}�����us'���N��%���VZɬ�4��w���Q&�v�Z�59l���%c��׳p��&�}٬mS_ck�� D�; ��^���H�_x~��Ǌ
]���"9�(�*���c��]���4ω�9(71�TY��eϨK��M||n�ZU��T,�o]�T0�U)����^q}{Z�7ш��@����s�=hu��S�Q���e�)Ɣ9�o��Ƈ��q[�g���][���-=��#*�h��Jv0*�{�42����t�f�1���M.���[�K���
L��b'o�$�\{�փ�謌�|�����Ž�(����Z�O�Ƶ�"��e(�W��R�oQ��p�����HѠ�c���:���P=�����k�c����������eQ�Ym��A6�� }7��S�	��(�Հ�#������/̚w��o���}`�<�jS�����0�4ۚ.��v2��[�@y�.� �򌵉K�e� ��<��c_�ku����)$û߁�`D}��0/�M~5/P�Y6�s���a^��W8n�ւ�d�mK��Ywm-�㣵�8j6���5e<��l����ʮˣ�5}+Əl����=�����-�@]R/"��D�'^�S�[�(
���:bf;5�IJ��!�:3&6�^ �H�6������<�{�>�$�<>؈J}�����]O�ן�Z�Pi�%����A)��T��4_� ِ�: �L��!7��{�Qegٍv�����%B�AM�]�SFe�q}
�� ?`[g��C��pߛ@�.��F�^6��>�q�	$/$��}j��J����˻�4�� ��
4�d	�@05�1�ph���h�s�?֑�)P���X����ᣧ�b�bS�j�T ��9,g�����9�nS.�w�pZDy����mN01X?Br|[��q����C�7��]exϋa=�{��)�ɅVh�Jd���D�H�3rَ��N
���Xm����<A@!Ռ`�
�����Lׅ� �5�B����߀  b��~�u�qs	��N�L61����Kd�l��"ume,E��R(�C+znTmM��DRf؄.��O�#�q�L2^ח ��X�ϏW��c���:������]čm;j|uk����æ������5/І[ʹ*�^��2g�Ai���4����1�,�Q���(p'��*�D�����q�h��0`���&��b'��|I��X��'�Q�*�|�s�Џ�
�}��82L�pق�"�Z�]����O�~!;����dz�#_��-����E}
��&imU�ѯ�U4P3@w��p6H�-q��hx�Q�z�����ֆ;,��>+��2�]��
��m�~�
�w���_���x��/�v�?��{Z$�԰�P��;�T܏����1��-�H���Q�;2�w4t�\2�v;�D�]ǺpS�`&]�-�J� �9��]AF��*�Z~tr�c�s��H�	^0R�\�g4(w�\�@%��bD?�%��g,��*/ކ���W�C���gn���4�
����/wOh7��xL�����ӧO�x�         s   x�K2MLJ6���51H1�51KNյ0L3�5II10J3006HI�4�T1JR14P�vv66*�J7�),*���r������K�4w�(3H	uw�LMs
�
��q��4����� 9q�         /   x�3�4�4202�5� "S+Sc+=cc������8W� *B
"     