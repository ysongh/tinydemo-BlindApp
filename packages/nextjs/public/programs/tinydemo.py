from nada_dsl import *

def nada_main():
    party1 = Party(name="Party1")
    party2 = Party(name="Party2")
    api_num = SecretInteger(Input(name="api_num", party=party1))
    guess = SecretInteger(Input(name="guess", party=party2))

    new_int = (api_num >= guess).if_else((api_num <= guess).if_else(Integer(1), Integer(2)), Integer(3))

    return [Output(new_int, "my_output", party2)]