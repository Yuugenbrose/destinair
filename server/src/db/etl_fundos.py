#!/usr/bin/env python3
"""
Transforma os CSVs oficiais de fundos habilitados (Receita Federal, 2026) em um
arquivo SQL de seed para a tabela `funds` do DestinaIR.

Fonte: Anexo I (FDCA) e Anexo II (FDI), listas de habilitados para receber
destinação do IRPF em 2026, publicadas pela Receita Federal.
"""
import csv

FDCA_PATH = "/mnt/user-data/uploads/Anexo_I_-_HABILITADOS_FDCA_2026.csv"
FDI_PATH = "/mnt/user-data/uploads/Anexo_II_-_HABILITADOS_FDI_2026.csv"
OUT_PATH = "/home/claude/etl/seed_fundos_completo.sql"

LEVEL_MAP = {"M": "MUNICIPAL", "E": "ESTADUAL", "N": "NACIONAL"}

# Nomes de estado por UF, com acentuação correta — usado em vez do texto livre
# "ESTADO DO/DA X" do CSV, que tem inconsistências reais na fonte oficial
# (ex: "ESTADO DO PARANA" sem til, enquanto outros municípios do mesmo estado
# aparecem corretamente acentuados, como "CORNÉLIO PROCÓPIO").
UF_NOME = {
    "AC": "Acre", "AL": "Alagoas", "AP": "Amapá", "AM": "Amazonas", "BA": "Bahia",
    "CE": "Ceará", "DF": "Distrito Federal", "ES": "Espírito Santo", "GO": "Goiás",
    "MA": "Maranhão", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul", "MG": "Minas Gerais",
    "PA": "Pará", "PB": "Paraíba", "PR": "Paraná", "PE": "Pernambuco", "PI": "Piauí",
    "RJ": "Rio de Janeiro", "RN": "Rio Grande do Norte", "RS": "Rio Grande do Sul",
    "RO": "Rondônia", "RR": "Roraima", "SC": "Santa Catarina", "SP": "São Paulo",
    "SE": "Sergipe", "TO": "Tocantins",
}

# Preposições que ficam em minúsculo no meio do nome (título em português)
LOWER_WORDS = {"de", "da", "do", "das", "dos", "e"}

# Ano de referência da base — usado para permitir trocar de base no futuro
# (apagar o ano antigo, importar o novo) sem misturar dados de anos diferentes.
DATA_YEAR = 2026


def title_case_pt(s):
    """Título em português: primeira letra maiúscula, preposições internas minúsculas."""
    words = s.strip().lower().split()
    out = []
    for i, w in enumerate(words):
        if i > 0 and w in LOWER_WORDS:
            out.append(w)
        else:
            out.append(w[:1].upper() + w[1:])
    return " ".join(out)


def format_cnpj(raw):
    d = raw.strip()
    return f"{d[0:2]}.{d[2:5]}.{d[5:8]}/{d[8:12]}-{d[12:14]}"


def sql_escape(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"


def sql_num(n):
    return "NULL" if n is None else str(n)


def build_name(tipo, level, uf, place):
    tipo_label = "Criança e do Adolescente" if tipo == "FDCA" else "Pessoa Idosa"
    if level == "NACIONAL":
        return f"Fundo Nacional dos Direitos da {tipo_label}"
    if level == "ESTADUAL":
        estado = UF_NOME.get(uf, title_case_pt(place.replace("ESTADO DO ", "").replace("ESTADO DE ", "").replace("ESTADO DA ", "")))
        return f"Fundo Estadual dos Direitos da {tipo_label} — {estado} ({uf})"
    cidade = title_case_pt(place)
    return f"Fundo Municipal dos Direitos da {tipo_label} de {cidade} ({uf})"


def load_rows(path, tipo):
    with open(path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        return [
            {
                "tipo": tipo,
                "level": LEVEL_MAP[r["ABRANGENCIA"]],
                "uf": r["UF"],
                "place": r["MUNICIPIO/ESTADO/BR"],
                "cnpj_raw": r["CNPJ"],
                "ibge": r["IBGE"],
            }
            for r in reader
        ]


def main():
    rows = load_rows(FDCA_PATH, "FDCA") + load_rows(FDI_PATH, "FDI")
    print(f"Total de linhas carregadas: {len(rows)}")

    values = []
    for r in rows:
        cnpj_raw = r["cnpj_raw"]
        fund_id = f"f-{cnpj_raw}"
        name = build_name(r["tipo"], r["level"], r["uf"], r["place"])
        level = r["level"]
        state = None if level == "NACIONAL" else r["uf"]
        city = title_case_pt(r["place"]) if level == "MUNICIPAL" else None
        cnpj = format_cnpj(cnpj_raw)

        values.append(
            "(" + ", ".join([
                sql_escape(fund_id),
                sql_escape(name),
                sql_escape(r["tipo"]),
                sql_escape(level),
                sql_escape(state),
                sql_escape(city),
                sql_escape(cnpj),
                sql_escape(r["ibge"]),
                str(DATA_YEAR),
                "1",
            ]) + ")"
        )

    cols = "(id, name, type, level, state, city, cnpj, ibge_code, data_year, is_active)"
    batch_size = 200
    with open(OUT_PATH, "w", encoding="utf-8") as out:
        out.write("-- Gerado automaticamente a partir dos Anexos I e II (Receita Federal, habilitados 2026).\n")
        out.write("-- NAO EDITAR A MAO -- reexecute etl_fundos.py se precisar regenerar.\n\n")
        for i in range(0, len(values), batch_size):
            batch = values[i:i + batch_size]
            out.write(f"INSERT OR REPLACE INTO funds {cols} VALUES\n")
            out.write(",\n".join(batch))
            out.write(";\n\n")

    print(f"Arquivo gerado: {OUT_PATH}")
    print(f"Total de fundos: {len(values)}")


if __name__ == "__main__":
    main()
